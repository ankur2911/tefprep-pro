# Audio Hosting Guide for TEFPrep Pro

## Option 1: GitHub (Recommended - Quick & Free)

### Steps:
1. Create a new public repository on GitHub
   - Name: `tefprep-audio`
   - Make it PUBLIC
   - Initialize with README

2. Upload your French audio MP3 files
   - Click "Add file" → "Upload files"
   - Upload all audio files
   - Commit changes

3. Get URLs for each file:
   - Click on a file
   - Click "Raw" button
   - Copy URL (format: `https://raw.githubusercontent.com/USERNAME/tefprep-audio/main/FILENAME.mp3`)

4. Add to Firestore questions:
   - Go to Firebase Console → Firestore
   - Find Compréhension Orale questions
   - Add field: `audioUrl: "https://raw.githubusercontent.com/..."`

### Example Question Update:
```javascript
{
  id: "co_beginner_01",
  question: "Écoutez l'audio et répondez:",
  audioUrl: "https://raw.githubusercontent.com/yourusername/tefprep-audio/main/co_beginner_01.mp3",
  options: ["A", "B", "C", "D"],
  correctAnswer: 2
}
```

## Option 2: Cloudinary (Also Free)

1. Sign up at cloudinary.com
2. Upload audio files
3. Copy URLs to questions

## Option 3: Firebase Storage (Once Fixed)

If you successfully create the bucket via Google Cloud Console:

1. Go to Firebase Console → Storage
2. Create `audio` folder
3. Upload MP3 files
4. Copy download URLs to questions

## Audio File Tips

- **Format**: MP3 (best compatibility)
- **Bitrate**: 128 kbps
- **Length**: 30-90 seconds
- **Naming**: `co_level_number.mp3` (e.g., `co_beginner_01.mp3`)
