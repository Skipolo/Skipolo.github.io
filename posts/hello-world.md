# Hello World: Interactive Data Visualization

Welcome to my data blog! In this first post, I'll demonstrate how we can combine Markdown content with interactive Plotly.js visualizations.

## Markdown Features

This blog supports all standard Markdown features:

- **Bold text** and *italic text*
- Lists (both ordered and unordered)
- Code blocks
- Links and images

### Code Example

Here's a simple Python code example:

```python
import plotly.express as px

# Create sample data
data = {'x': [1, 2, 3, 4, 5],
        'y': [2, 4, 6, 8, 10]}

# Create a line plot
fig = px.line(data, x='x', y='y', title='Sample Line Plot')
fig.show()
```

## Interactive Visualization

Below is an interactive Plotly chart that you can zoom, pan, and hover over:

<div class="plotly-graph" data-plotly='{
    "data": [
        {
            "x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "y": [2, 4, 7, 4, 9, 6, 8, 5, 7, 8],
            "type": "scatter",
            "mode": "lines+markers",
            "name": "Sample Data"
        }
    ],
    "layout": {
        "title": "Interactive Line Chart",
        "xaxis": {
            "title": "Time"
        },
        "yaxis": {
            "title": "Value"
        },
        "showlegend": true,
        "hovermode": "closest"
    }
}'></div>

## Adding More Charts

You can add multiple charts to a single post, and they'll all be interactive. Here's a bar chart example:

<div class="plotly-graph" data-plotly='{
    "data": [
        {
            "x": ["A", "B", "C", "D", "E"],
            "y": [4, 6, 3, 8, 5],
            "type": "bar",
            "name": "Categories"
        }
    ],
    "layout": {
        "title": "Sample Bar Chart",
        "xaxis": {
            "title": "Category"
        },
        "yaxis": {
            "title": "Count"
        },
        "showlegend": true
    }
}'></div>

## Conclusion

This blog setup allows you to:
1. Write content in Markdown for easy formatting
2. Embed interactive Plotly charts
3. Mix and match different types of content
4. Create engaging data visualizations

Feel free to explore the interactive features of the charts above! 