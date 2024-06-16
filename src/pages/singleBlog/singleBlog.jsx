import React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Comments from '../../components/comments/comments';
import Cookies from 'js-cookie';
import './singleBlog.css';
import profile from '../../images/profile.png'

export default function SingleBlog() {
    const [singleBlogInfo, setSingleBlogInfo] = React.useState(null);
    const [comments, setComments] = React.useState([]);
    const { id } = useParams();
    const token = Cookies.get('token') /* || null */; 

  React.useEffect(() => {
    async function fetchSingleBlog() {
      try {
        const response = await axios.get(`https://course-finder-app.onrender.com/post/${id}`, { withCredentials: true });
        setSingleBlogInfo(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchSingleBlog();
  }, []);

  React.useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get(`https://course-finder-app.onrender.com/post/${id}/comments`, { withCredentials: true });
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
      <img src={`https://course-finder-app.onrender.com/${singleBlogInfo.image}`} className='course-image'/>
      <div className='image-name-edit-followers'>
        <div className='image-name'>
          <img src={profile} alt="" className="image-name-img" />
          <h2>{singleBlogInfo.creator.username}</h2>
        </div>

        <div className='edit-followers'>
          <button className='follow-button'><span className="follow-count">Follow</span></button>
          {singleBlogInfo.creator._id === singleBlogInfo.creator._id && (
            <div>
              <Link to={`/edit/${singleBlogInfo._id}`}><button className='edit-button'>Edit</button></Link>
            </div>
          )}
        </div>
      </div>
      
      <h1>{singleBlogInfo.title}</h1>
      
      <p className='single-blog-description'>{singleBlogInfo.description}</p>

      <Comments comments={comments} postId={id} setComments={setComments} token={token} />
    </div> 
  );
}

