import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Comments from '../../components/comments/comments';

export default function SingleBlog() {
  const [singleBlogInfo, setSingleBlogInfo] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchSingleBlog() {
      try {
        const response = await axios.get(`http://localhost:4000/post/${id}`, { withCredentials: true });
        setSingleBlogInfo(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchSingleBlog();
  }, []);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get(`http://localhost:4000/post/${id}/comments`, { withCredentials: true });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchComments();
  }, [id]);

  if (!singleBlogInfo) return null;

  return (
    <div>
      <img src={`http://localhost:4000/${singleBlogInfo.image}`} />
      <div>{singleBlogInfo.creator.username}</div>
      {singleBlogInfo.creator._id === singleBlogInfo.creator._id && (
        <div>
          <Link to={`/edit/${singleBlogInfo._id}`}><button>Edit</button></Link>
        </div>
      )}
      <h1>{singleBlogInfo.title}</h1>
      <p>{singleBlogInfo.description}</p>

      <Comments comments={comments} />
    </div>
  );
}




COMMENTS 2
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comments({ comments, postId, setComments, token}) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/post/${postId}/comment`, {
        commentText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },{ withCredentials: true });
      setCommentText('');
      setComments((prevComments) => [...prevComments, response.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>
      {comments.map((comment) => (
        <div key={comment._id}>
          <div>{comment.creator && comment.creator.username}</div>
          <div>{comment.text}</div>
        </div>
      ))}
    </div>
  );
}







createblog

import React from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './createBlog.css';
import Cookies from 'js-cookie';

export default function CreateBlog(){
    const [title, setTitle] = React.useState('');
    const [summary, setSummary] = React.useState('');
    const [files, setFiles] = React.useState(null);
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState(''); 
    const navigate = useNavigate();
    const token = Cookies.get('token')

    async function submitBlog(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('description', description);
        data.append('category', category);
        if (files) {
            data.append('file', files[0]);
        }

        try {
            const response = await axios.post('/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization : `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if(response.data.error){
                toast.error(response.data.error);
            } else {
                toast.success("Blog Uploaded");
                navigate('/'); 
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while uploading the blog");
        }
    }

    return (
        <form onSubmit={submitBlog} className="create-blog-form">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="full-width"/>
            <input type="text" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required className="full-width"/>
            <input type="file" onChange={e => setFiles(e.target.files)} required className="full-width"/>
            <input type="text" placeholder="Category" onChange={e => setCategory(e.target.value)} required className="full-width"/>
            <textarea name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="full-width"/>
            <button type="submit" className="full-width-btn">Create Blog</button>
        </form>
    );
}
