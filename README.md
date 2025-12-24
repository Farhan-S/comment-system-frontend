# Comment System Frontend# React + TypeScript + Vite

A modern, fully-featured comment system built with React, TypeScript, Redux Toolkit, and MERN stack. This application allows authenticated users to view, create, edit, delete, like, and dislike comments with real-time updates and nested replies.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🚀 FeaturesCurrently, two official plugins are available:

### Core Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- ✅ **User Authentication** (JWT-based)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  - User registration with validation

  - User login## React Compiler

  - Protected routes

  - Persistent authenticationThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- ✅ **Comment Management**## Expanding the ESLint configuration

  - Create comments

  - Edit own commentsIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

  - Delete own comments

  - View all comments with pagination```js

  - Nested comment repliesexport default defineConfig([

  globalIgnores(['dist']),

- ✅ **Engagement Features** {

  - Like/Unlike comments (one vote per user) files: ['**/*.{ts,tsx}'],

  - Dislike comments (one vote per user) extends: [

  - Automatic vote switching (like to dislike and vice versa) // Other configs...

  - Real-time like/dislike counts

    // Remove tseslint.configs.recommended and replace with this

- ✅ **Sorting & Filtering** tseslint.configs.recommendedTypeChecked,

  - Sort by newest // Alternatively, use this for stricter rules

  - Sort by most liked tseslint.configs.strictTypeChecked,

  - Sort by most disliked // Optionally, add this for stylistic rules

  - Filter top-level comments only tseslint.configs.stylisticTypeChecked,

- ✅ **Pagination** // Other configs...

  - Configurable page size ],

  - Page navigation languageOptions: {

  - Total comment count parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Optional Features tsconfigRootDir: import.meta.dirname,

- ⚡ **Real-time Updates** (Socket.IO ready - to be integrated with backend) },

- 🎨 **Responsive Design** (Mobile, Tablet, Desktop) // other options...

- ♿ **Accessibility** (ARIA labels, keyboard navigation) },

- 🎯 **TypeScript** (Full type safety) },

- 🎨 **Modern UI/UX** (Gradient themes, smooth animations)])

````

## 🛠️ Tech Stack

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

### Frontend

- **React 19** - UI library```js

- **TypeScript** - Type safety// eslint.config.js

- **Redux Toolkit** - State managementimport reactX from 'eslint-plugin-react-x'

- **React Router v6** - Routing and navigationimport reactDom from 'eslint-plugin-react-dom'

- **Axios** - HTTP client with interceptors

- **Socket.IO Client** - Real-time communication (ready)export default defineConfig([

- **SCSS/Sass** - Styling  globalIgnores(['dist']),

  {

### Build Tools    files: ['**/*.{ts,tsx}'],

- **Vite** - Fast build tool    extends: [

- **ESLint** - Code linting      // Other configs...

      // Enable lint rules for React

## 📦 Installation      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

### Prerequisites      reactDom.configs.recommended,

- Node.js (v18 or higher)    ],

- npm or yarn    languageOptions: {

- Backend API running (default: http://localhost:5000)      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Setup        tsconfigRootDir: import.meta.dirname,

      },

1. **Clone the repository**      // other options...

   ```bash    },

   git clone <repository-url>  },

   cd comment-system-frontend])

````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   Or copy from example:

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── app/
│   ├── store.ts              # Redux store configuration
│   └── hooks.ts              # Custom Redux hooks
├── features/
│   ├── auth/
│   │   └── authSlice.ts      # Authentication state management
│   └── comments/
│       └── commentSlice.ts   # Comments state management
├── components/
│   ├── CommentForm.tsx       # Form for creating/replying comments
│   ├── CommentForm.scss
│   ├── CommentList.tsx       # List of comments
│   ├── CommentList.scss
│   ├── CommentItem.tsx       # Individual comment component
│   ├── CommentItem.scss
│   ├── Pagination.tsx        # Pagination component
│   ├── Pagination.scss
│   ├── SortMenu.tsx          # Sort dropdown menu
│   ├── SortMenu.scss
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Register.tsx          # Registration page
│   ├── CommentsPage.tsx      # Main comments page
│   ├── CommentsPage.scss
│   └── Auth.scss             # Shared auth styles
├── routes/
│   └── AppRouter.tsx         # App routing configuration
├── services/
│   └── api.ts                # API service layer (Axios)
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Root component
├── App.css                   # Global styles
├── main.tsx                  # Application entry point
└── index.css                 # Base CSS
```

## 🔌 API Integration

The frontend connects to the backend API using the base URL configured in `.env`.

### API Endpoints Used

**Authentication**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

**Comments**

- `GET /api/comments` - Get all comments (with pagination, sorting)
- `GET /api/comments/:id` - Get comment by ID
- `GET /api/comments/:id/replies` - Get comment replies
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment
- `POST /api/comments/:id/dislike` - Dislike comment

## 🎯 Usage

### User Flow

1. **Registration/Login**

   - Navigate to `/register` to create an account
   - Or go to `/login` to sign in
   - Upon successful authentication, you'll be redirected to `/comments`

2. **Viewing Comments**

   - All top-level comments are displayed on the main page
   - Use the sort menu to change sorting (Newest, Most Liked, Most Disliked)
   - Navigate through pages using pagination controls

3. **Creating Comments**

   - Type your comment in the text area at the top
   - Click "Post Comment" to submit
   - Maximum 1000 characters per comment

4. **Replying to Comments**

   - Click "Reply" button on any comment
   - A reply form will appear below the comment
   - Submit your reply

5. **Editing Comments**

   - Click "Edit" on your own comments
   - Modify the content and click "Save"

6. **Deleting Comments**

   - Click "Delete" on your own comments
   - Confirm the deletion

7. **Liking/Disliking**
   - Click 👍 to like a comment
   - Click 👎 to dislike a comment
   - You can only vote once (switching is allowed)

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- Token is stored in `localStorage`
- Token is automatically attached to API requests via Axios interceptor
- User is redirected to login if token expires (401 response)
- Protected routes check authentication status

## 🎨 Styling

The application uses SCSS for styling with:

- Component-scoped styles
- Responsive design (mobile-first approach)
- CSS variables for theming
- Smooth transitions and animations
- Gradient color schemes

## 🚀 Build & Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

The static build can be deployed to:

- **Vercel** (recommended for Vite apps)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Any static hosting service

#### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

#### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Environment Variables

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript** - Full type coverage
- **ESLint** - Code linting
- **Prettier** (recommended) - Code formatting

## 🔮 Future Enhancements

- ✨ Real-time updates with Socket.IO
- 🔍 Search functionality
- 🏷️ Comment tagging/mentions
- 📊 User profile pages
- 🌙 Dark mode
- 🔔 Notifications
- 📎 File attachments
- 🎭 Comment reactions (emoji)
- ⚡ Optimistic UI updates
- 🔄 Infinite scroll option
- 💾 Draft comments (localStorage)

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built as part of MERN stack comment system assignment
- Follows modern React and TypeScript best practices
- Implements Redux Toolkit recommended patterns

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Made with ❤️ using React + TypeScript + Redux Toolkit
