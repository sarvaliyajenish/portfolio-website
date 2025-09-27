import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create buckets on startup
async function initializeBuckets() {
  const resumeBucketName = 'make-654b3b0b-resumes';
  const imagesBucketName = 'make-654b3b0b-images';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create resume bucket
    const resumeBucketExists = buckets?.some(bucket => bucket.name === resumeBucketName);
    if (!resumeBucketExists) {
      await supabase.storage.createBucket(resumeBucketName, {
        public: false,
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 5242880 // 5MB
      });
      console.log(`Created bucket: ${resumeBucketName}`);
    }
    
    // Create images bucket
    const imagesBucketExists = buckets?.some(bucket => bucket.name === imagesBucketName);
    if (!imagesBucketExists) {
      await supabase.storage.createBucket(imagesBucketName, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });
      console.log(`Created bucket: ${imagesBucketName}`);
    }
  } catch (error) {
    console.error('Error initializing buckets:', error);
  }
}

// Initialize buckets
await initializeBuckets();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-654b3b0b/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload resume endpoint
app.post("/make-server-654b3b0b/upload-resume", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.text("No file provided", 400);
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return c.text("Invalid file type. Please upload PDF or Word document.", 400);
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.text("File size exceeds 5MB limit", 400);
    }

    const bucketName = 'make-654b3b0b-resumes';
    const fileName = `resume-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return c.text(`Upload failed: ${error.message}`, 500);
    }

    // Create signed URL for download
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      return c.text(`Failed to create download URL: ${signedUrlError.message}`, 500);
    }

    // Store resume info in KV store
    await kv.set('resume_info', {
      fileName: fileName,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      signedUrl: signedUrlData.signedUrl
    });

    return c.json({
      success: true,
      url: signedUrlData.signedUrl,
      fileName: file.name
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return c.text(`Server error: ${error.message}`, 500);
  }
});

// Remove resume endpoint
app.delete("/make-server-654b3b0b/remove-resume", async (c) => {
  try {
    const resumeInfo = await kv.get('resume_info');
    
    if (resumeInfo && resumeInfo.fileName) {
      const bucketName = 'make-654b3b0b-resumes';
      
      // Delete from storage
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([resumeInfo.fileName]);

      if (error) {
        console.error('Delete error:', error);
        return c.text(`Failed to delete file: ${error.message}`, 500);
      }
    }

    // Remove from KV store
    await kv.del('resume_info');

    return c.json({ success: true });

  } catch (error) {
    console.error('Resume removal error:', error);
    return c.text(`Server error: ${error.message}`, 500);
  }
});

// Get resume info endpoint
app.get("/make-server-654b3b0b/resume-info", async (c) => {
  try {
    const resumeInfo = await kv.get('resume_info');
    
    if (!resumeInfo) {
      return c.json({ hasResume: false });
    }

    // Check if the signed URL is still valid and refresh if needed
    const bucketName = 'make-654b3b0b-resumes';
    const { data: signedUrlData, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(resumeInfo.fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (error) {
      console.error('Signed URL refresh error:', error);
      return c.json({ hasResume: false });
    }

    // Update stored info with new signed URL
    const updatedInfo = {
      ...resumeInfo,
      signedUrl: signedUrlData.signedUrl
    };
    await kv.set('resume_info', updatedInfo);

    return c.json({
      hasResume: true,
      url: signedUrlData.signedUrl,
      fileName: resumeInfo.originalName,
      uploadedAt: resumeInfo.uploadedAt
    });

  } catch (error) {
    console.error('Resume info error:', error);
    return c.json({ hasResume: false });
  }
});

// Upload image endpoint
app.post("/make-server-654b3b0b/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.text("No file provided", 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.text("Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.", 400);
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.text("File size exceeds 10MB limit", 400);
    }

    const bucketName = 'make-654b3b0b-images';
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Image upload error:', error);
      return c.text(`Upload failed: ${error.message}`, 500);
    }

    // Create signed URL for access
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      return c.text(`Failed to create image URL: ${signedUrlError.message}`, 500);
    }

    return c.json({
      success: true,
      url: signedUrlData.signedUrl,
      fileName: fileName,
      originalName: file.name
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return c.text(`Server error: ${error.message}`, 500);
  }
});

// Delete image endpoint
app.delete("/make-server-654b3b0b/delete-image/:fileName", async (c) => {
  try {
    const fileName = c.req.param('fileName');
    
    if (!fileName) {
      return c.text("No filename provided", 400);
    }

    const bucketName = 'make-654b3b0b-images';
    
    // Delete from storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error('Image delete error:', error);
      return c.text(`Failed to delete image: ${error.message}`, 500);
    }

    return c.json({ success: true });

  } catch (error) {
    console.error('Image deletion error:', error);
    return c.text(`Server error: ${error.message}`, 500);
  }
});

Deno.serve(app.fetch);