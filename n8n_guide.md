# How to Create Posts from n8n

Follow these steps to automate blog post creation using n8n.

## Prerequisites
1.  **n8n Installed**: Either self-hosted or n8n Cloud.
2.  **API Access**: Your Blog App's backend must be accessible to n8n.
    - If n8n and your app are both on **localhost**, use `http://host.docker.internal:5001/api/posts` (if n8n is in Docker) or `http://localhost:5001/api/posts` (if native).
    - If n8n is on the **Cloud**, you must deploy your backend (e.g., Render/Heroku) or use a tunnel like `ngrok` to expose your local server.

## n8n Workflow Steps

### 1. Add an "HTTP Request" Node
Drag an **HTTP Request** node onto your canvas.

### 2. Configure the Node
Settings for the HTTP Request node:

- **Method**: `POST`
- **URL**: `YOUR_BACKEND_URL/api/posts`
  - *Example*: `https://api.blogshaik.com/api/posts` or `http://your-ip:5001/api/posts`
- **Authentication**: None (unless you implemented auth, currently open).
- **Send Headers**: Toggle **On**.
  - Add Header: `Content-Type` = `application/json`
- **Body Content Type**: `JSON`
- **Body Parameters**:

```json
{
  "title": "Title from n8n",
  "content": "<h1>HTML Content</h1><p>This post was sent automatically...</p>",
  "author": "n8n Bot",
  "excerpt": "Automated post via n8n workflow.",
  "coverImage": "https://example.com/image.jpg"
}
```

### 3. Dynamic Data mapping
If you are coming from an RSS Feed, AI Agent, or Google Sheet:
- Click the **Expression** icon (gears) next to the fields in the JSON body.
- Drag and drop fields from your previous nodes (e.g., `{{ $json.title }}`).

## Testing
1.  Click **Execute Node**.
2.  Check the "Output" tab in n8n. You should see a `201 Created` status and the new Post object.
3.  Refresh your BlogShaik homepage to see the new post!
