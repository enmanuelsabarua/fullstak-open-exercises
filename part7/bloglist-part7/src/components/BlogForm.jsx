const BlogForm = ({ handleAddBlog, setTitle, setAuthor, setUrl, title, author, url }) => {
    return (
        <form onSubmit={handleAddBlog}>
            <div>
                title:
                <input value={title} id="title" type="text" name="title" onChange={({ target }) => setTitle(target.value)}/>
            </div>
            <div>
                author:
                <input value={author} id="author" type="text" name="author" onChange={({ target }) => setAuthor(target.value)}/>
            </div>
            <div>
                url:
                <input value={url} id="url" type="text" name="url" onChange={({ target }) => setUrl(target.value)}/>
            </div>
            <button id="create-blog-button" type="submit">create</button>
        </form>
    );
}

export default BlogForm;