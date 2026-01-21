import Navbar from './components/Navbar';
import SideProfile from './components/SideProfile';
import CreatePost from './components/CreatePost';
import Auth from './pages/Auth';

function App() {
  return (
    <>
      <Auth />
      <div className='nav'>
        <Navbar />
      </div>
      <div className="layout">
        <SideProfile />
        <div className="feed">
          <CreatePost />
        </div>
      {/* <div className="rightBar"></div> */}
      </div>
    </>
  );
}

export default App;
