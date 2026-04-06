import './CreatePost.css';

export default function CreatePost() {
    return (
        <>
            <div className="createPost">
                <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="profile"
                    className="profile-img"
                />
                <input type="text" placeholder="Write a post" className="inputPost"/>
                <ul>
                    <li>
                        Video
                    </li>
                    <li>
                        Photo
                    </li>
                    <li>
                        Write Article
                    </li>
                </ul>
            </div>
        </>
    )
}