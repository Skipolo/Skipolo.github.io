# Interactive Data Blog

A lightweight, modern blog platform that supports interactive data visualizations using Plotly.js. Built for GitHub Pages, this blog requires no backend or build tools.

## Features

- 📝 Markdown support for easy content creation
- 📊 Interactive Plotly.js visualizations
- 📱 Mobile-responsive design
- ⚡ Fast loading with no build step
- 🎨 Clean, modern UI

## Setup Instructions

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `yourusername.github.io` (replace with your GitHub username)
   - Make it public
   - Initialize with a README

2. **Clone and Add Files**
   ```bash
   git clone https://github.com/yourusername/yourusername.github.io.git
   cd yourusername.github.io
   ```

3. **Copy the Blog Files**
   - Copy all files from this repository to your cloned directory
   - The structure should look like this:
     ```
     yourusername.github.io/
     ├── index.html
     ├── style.css
     ├── README.md
     ├── posts/
     │   └── hello-world.md
     └── scripts/
         └── main.js
     ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click "Save"

5. **View Your Site**
   - Wait a few minutes for GitHub Pages to build
   - Visit `https://yourusername.github.io`

## Creating New Posts

1. Create a new `.md` file in the `posts/` directory
2. Add the post metadata to the `posts` array in `scripts/main.js`:
   ```javascript
   {
       id: 'your-post-id',
       title: 'Your Post Title',
       date: 'YYYY-MM-DD',
       preview: 'A brief preview of your post',
       content: await fetch('posts/your-post.md').then(res => res.text())
   }
   ```

## Adding Interactive Charts

To add a Plotly chart to your post, use this HTML snippet:

```html
<div class="plotly-graph" data-plotly='{
    "data": [
        {
            "x": [1, 2, 3],
            "y": [4, 5, 6],
            "type": "scatter",
            "mode": "lines+markers"
        }
    ],
    "layout": {
        "title": "Your Chart Title"
    }
}'></div>
```

## Local Development

1. Install a local server (optional but recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

2. Open `http://localhost:8000` in your browser

## Customization

- Edit `style.css` to change the blog's appearance
- Modify `scripts/main.js` to add new features
- Update the header in `index.html` to change the blog title and description

## License

MIT License - feel free to use this template for your own blog! 