# Blogging App API Documentation

This documentation details the API endpoints available for the Blogging App, including the new social features (Likes, Dislikes, Comments) and image support.

**Base URL**: `http://localhost:5001/api`

## Data Models

### Post Object
```json
{
  "_id": "65b...",
  "title": "Post Title",
  "content": "Full content...",
  "excerpt": "Short summary...",
  "author": "Author Name",
  "coverImage": "https://example.com/image.jpg",
  "likes": 0,
  "dislikes": 0,
  "views": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Comment Object
```json
{
  "_id": "65c...",
  "postId": "65b...",
  "parentCommentId": "null (or commentId for replies)",
  "author": "User Name",
  "content": "Comment text...",
  "likes": 0,
  "dislikes": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## API Endpoints

### 1. Posts (`/posts`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/posts` | Retrieve all blog posts (sorted by newest) |
| `GET` | `/posts/:id` | Retrieve a single post by ID |
| `GET` | `/posts/:id/related` | Retrieve related/recent posts (excluding current) |
| `POST` | `/posts` | Create a new blog post |
| `PUT` | `/posts/:id` | Update an existing post by ID |
| `DELETE` | `/posts/:id` | Delete a post by ID |
| `POST` | `/posts/:id/like` | Increment Like count |
| `POST` | `/posts/:id/dislike` | Increment Dislike count |
| `POST` | `/posts/:id/view` | Increment View count |

### 2. Comments (`/comments`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/comments/post/:postId` | Retrieve all comments for a specific post |
| `POST` | `/comments` | Add a new comment (or reply) |
| `POST` | `/comments/:id/like` | Like a comment |
| `POST` | `/comments/:id/dislike` | Dislike a comment |

---

## Postman Testing Examples

### Create a New Post with Image
- **Method**: `POST`
- **URL**: `http://localhost:5001/api/posts`
- **Payload**:
  ```json
  {
    "title": "Delicious Pancakes",
    "content": "Here is the recipe...",
    "author": "Mrs. Frost",
    "excerpt": "Fluffy breakfast delight.",
    "coverImage": "https://images.unsplash.com/photo-1598214886806-c87b84b7078b"
  }
  ```

### Add a Comment
- **Method**: `POST`
- **URL**: `http://localhost:5001/api/comments`
- **Payload**:
  ```json
  {
    "postId": "YOUR_POST_ID",
    "author": "John Doe",
    "content": "Looks delicious!",
    "parentCommentId": null 
  }
  ```
  *(Note: To reply to a comment, set `parentCommentId` to the ID of the comment you are replying to)*

### Like a Post
- **Method**: `POST`
- **URL**: `http://localhost:5001/api/posts/YOUR_POST_ID/like`
- **Body**: None
- **Result**: Returns the updated Post object with incremented likes.

---

## Automation & Integrations (n8n / Zapier)

To create posts automatically from tools like **n8n** or **Zapier**:
1.  Use the `POST /posts` endpoint.
2.  Ensure `Content-Type` header is set to `application/json`.
3.  Send the raw JSON body. HTML content in the `content` field will be rendered correctly by the frontend rich text viewer.

See `n8n_guide.md` for a detailed tutorial.
