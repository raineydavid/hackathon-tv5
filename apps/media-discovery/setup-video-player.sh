#!/bin/bash
# Setup script for Video Player and Gemini Audio Integration

set -e

echo "🎬 Setting up Video Player & Gemini Audio Integration"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the media-discovery app directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🔑 Next steps:"
echo ""
echo "1. Get a Google Generative AI API key:"
echo "   - Go to: https://makersuite.google.com/app/apikey"
echo "   - Click 'Create API Key'"
echo "   - Copy the key"
echo ""
echo "2. Add the API key to your .env file:"
echo "   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see VIDEO_PLAYER_GUIDE.md"
echo ""
