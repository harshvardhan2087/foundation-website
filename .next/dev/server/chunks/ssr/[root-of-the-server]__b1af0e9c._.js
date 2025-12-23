module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/team/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadToCloudinary",
    ()=>uploadToCloudinary
]);
async function uploadToCloudinary(file) {
    console.log("📤 Uploading to Cloudinary:", file.name, file.type, file.size);
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', ("TURBOPACK compile-time value", "harsh") || 'your_upload_preset');
    formData.append('folder', 'team-members');
    formData.append('timestamp', Date.now().toString());
    try {
        // Upload to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${("TURBOPACK compile-time value", "dkvopbma2") || 'your_cloud_name'}/image/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Cloudinary upload failed:', response.status, errorData);
            throw new Error(`Upload failed: ${response.status} ${errorData}`);
        }
        const data = await response.json();
        console.log('✅ Cloudinary response:', data);
        if (!data.secure_url) {
            throw new Error('No secure URL returned from Cloudinary');
        }
        return data.secure_url;
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error);
        throw error;
    }
}
}),
"[project]/app/team/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/team/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b1af0e9c._.js.map