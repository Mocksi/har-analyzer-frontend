HAR Analyzer Frontend

A React-based frontend for analyzing HAR (HTTP Archive) files with AI-powered insights.

## Quick Start

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

## Configuration

Create a `.env` file in the root directory:
REACT_APP_API_URL=http://localhost:3001

For production, update the API URL accordingly.

## Project Structure

src/
- components/: React components
- utils/: Helper functions
- hooks/: Custom React hooks
- App.js: Main app component
- index.js: Entry point

## Key Features

- HAR file upload and validation
- Real-time analysis progress tracking
- Interactive performance visualizations
- AI-powered insights display
- Persona-based result filtering

## Development

### Prerequisites
- Node.js 18+
- npm 8+

### Running Tests
npm test

### Code Style
- Uses ESLint with Airbnb config
- Prettier for formatting
- Run `npm run lint` to check style
- Run `npm run format` to format code

## API Integration

The frontend communicates with the backend through:
- `/analyze` - POST endpoint for HAR file upload
- `/results/:jobId` - GET endpoint for analysis results

## Dependencies

Key libraries:
- React 18
- React Router 6
- Axios
- Chart.js
- date-fns

## Error Handling

- Network errors show user-friendly messages
- File size validation on upload
- Graceful degradation for missing features

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+

## Future Improvements

- [ ] Add offline support
- [ ] Implement result caching
- [ ] Add batch file processing