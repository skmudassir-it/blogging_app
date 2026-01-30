# Process of Development

This log documents the major stages of development for the Blogging App.

## Phase 1: Initialization & Backbone
1.  **Requirement Analysis**: Defined needs for a specialized blogging platform with admin capabilities.
2.  **Backend Setup**:
    - Initialized Node.js/Express project.
    - Connected to MongoDB Atlas.
    - Created basic `Post` schema and CRUD API routes.
3.  **Frontend Setup**:
    - Scaffolded React app with Vite.
    - Configured Tailwind CSS.
    - Implemented basic API client using `axios`.

## Phase 2: Core Functionality
1.  **Pages Implementation**:
    - Created `Home` (List), `PostDetail` (Read), `AdminDashboard` (Manage), and `Editor` (Create/Update).
    - Set up React Router navigation.
2.  **Verification**: Tested CRUD operations via Frontend and cURL.

## Phase 3: Visual Redesign (Modern Style)
1.  **Aesthetic Overhaul**:
    - Adopted a clean, food-blog style inspired by reference images.
    - **Typography**: Switched to `Playfair Display` (Serif) and `Lato` (Sans), removing generic fonts.
    - **Layout**: Moved to a centered, wide-grid layout for the home page.
2.  **Image Support**: added `coverImage` field to allow URL-based image embedding in posts.

## Phase 4: Social & Interactive Features
1.  **Database Expansion**:
    - Added `likes`, `dislikes`, `views` to `Post` model.
    - Created `Comment` model supporting parent-child relationships (replies).
2.  **Backend Logic**:
    - Added endpoints for incrementing counters (Like/Dislike).
    - Added logic to fetch threaded comments.
3.  **Frontend Social Integration**:
    - Built a robust `CommentItem` component that renders recursively for replies.
    - Added a social bar to the `PostDetail` page.
    - Added "Recent Posts" grid to the bottom of articles.

## Phase 5: Documentation & Polish
1.  Created comprehensive documentation (this file, README, Tech Stack).
2.  Final verification of all features.
