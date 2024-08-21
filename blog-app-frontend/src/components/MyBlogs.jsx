import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ENDPOINT } from "../config/endpoint";

export const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  let id = "";
  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    console.log("token: ", token);
    if (!token) {
      navigate("/");
    }
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);

    id = decodedToken._id;

    document.cookie = `token=${token}`;

    try {
      const res = await axios.get(`${ENDPOINT}/myposts/${id}`, {
        withCredentials: true,
      });
      console.log("posts: ", res.data.posts);

      const data = res.data.posts;
      console.log("posts: ", data);
      setPosts(data);
    } catch (err) {
      return toast.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(`${ENDPOINT}/posts/${id}`, {
        withCredentials: true,
      });

      console.log("posts: ", res.data.posts);
      console.log("deleted id: ", id);

      if (res.data.success) {
        toast.success(res.data.msg);
        fetchPosts();
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      return toast.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-wrap gap-8 px-[7em] py-10 text-black -mt-2 mb-[2em]">
      {/* <Toaster /> */}
      <h2 className="text-3xl text-center font-semibold text-slate-500">
        My Blogs
      </h2>
      {posts.length === 0 ? (
        <h2 className="text-xl text-start font-semibold text-slate-500">
          No blogs
        </h2>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-8 mt-2">
          {posts.map((post, index) => (
            <div
              key={index}
              className="flex flex-col text-white bg-slate-500 gap-6 items-center justify-between shadow-md shadow-slate-700 rounded-sm p-7 w-[20em] h-[18em] break-words"
            >
              <div className="flex flex-col gap-6">
                <p className="text-xl uppercase text-center">
                  {post.title.length > 40
                    ? post.title.substr(0, 40) + "..."
                    : post.title}
                </p>{" "}
                <p className="">
                  {post.description.length > 120
                    ? post.description.substr(0, 120) + "..."
                    : post.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-5 w-full">
                <Link
                  to={`/blogs/${post._id}`}
                  state={{ id: post._id }}
                  className="bg-teal-500 text-black font-semibold p-[0.4em] px-3 rounded-sm shadow-md"
                >
                  Show
                </Link>
                <Link
                  to={`/my-blogs/${post._id}`}
                  state={{
                    _id: post._id,
                    title: post.title,
                    description: post.description,
                  }}
                  className="bg-yellow-100 text-black font-semibold p-[0.4em] rounded-sm shadow-md"
                >
                  Update
                </Link>
                <button
                  onClick={() => deleteBlog(post._id)}
                  className="bg-red-300 text-black font-semibold p-[0.4em] px-3 rounded-sm shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
