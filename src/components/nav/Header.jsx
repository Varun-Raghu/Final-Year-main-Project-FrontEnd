import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [current, setCurrent] = useState('h');
  const [isOpen, setOpen] = useState(true);
  const closeMenu =() => setOpen(true);
  const navigate=useNavigate()
  const [username, setUsername] = useState(localStorage.getItem('first_name'))
  const [profile, setProfile] = useState(localStorage.getItem('profile_pic'))
  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [subscription, setSubscription] = useState(null);
  const sendSubscriptionToServer = async (subscription) => {
    try {
      // Send subscription object to your server using Axios
      const response = await axios.post('https://agroharvest.onrender.com/send-push-notification/', subscription, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Subscription sent to server');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  };
  console.log(subscription  )
  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: 'YOUR_INSTANCE_ID_HERE', // Replace with your Pusher Beams instance ID
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest('hello'))
      .then(() => console.log('Successfully registered and subscribed!'))
      .catch(console.error);

    // Clean up function
    return () => {
      // Stop Pusher Beams client when component unmounts
      beamsClient.stop();
    };
  }, []);

  const handleSubmit = async(e)=>{
    e.preventDefault()
    closeMenu();
    if (email) {
      const res = await axios.post('https://agroharvest.onrender.com/api/v1/auth/changePassword/', {'email': email})
      console.log(res)
       if (res.status === 200) {
        const response = res.data
        console.log(response)
        const uidb64 = response['uidb64']
        const token = response['token']
        navigate(`/password-reset-confirm/${uidb64}/${token}`);
        
       } 
    }
    
    
 }
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.profile-cont')) {
        setOpen(true);
      }
    };

    if (!isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage when the button is clicked
    setUsername("")
    setProfile("")
    setEmail("")
  };

  return (
    <>
      <div className='header'>
        <div className='logo-section'>
          <img src='https://cdn-icons-png.flaticon.com/128/15730/15730298.png'></img>
          <Link to='/'>Agro Harvest</Link>
        </div>
        <nav className='menu'>
        {username &&
          <ul className='navigation'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='LSM/'>Register Your Land</Link></li>
            <li><Link to='crs/'>Crop Recommendation System</Link></li>
            <li><Link to='cys/'>Crop Yield Prediction</Link></li>
            <li><Link to='fertilizer/'>Fertilizers</Link></li>
            <li><Link to='irrigation/'>Irrigation</Link></li>
          </ul>
}
          <div className='nav2'>
            {!username ? (
              <Link to="/login" className="signin">
                Sign in
              </Link>
            ) : (
              <>
                <div className='profile-cont'>
                  <div className="profile">
                    <img src={profile} alt="Profile" className="profile-img" onClick={() => setOpen((prev) => !prev)} />
                  </div>
                  <nav className={isOpen ? 'profile-dropdown-active' : 'profile-dropdown'}>
                    <div className="triangle"></div>
                    <ul className='profile-options'>
                      <li className='user-prof'>
                        <div className="profile">
                          <img src={profile} alt="Profile" className="profile-img" />
                        </div>
                        <div className='user-gist'>
                          <p className='username'>{username}</p>
                          <p className='email'>{email}</p>
                        </div>
                      </li>
                      <Link to='/profile_update'><li className='prof-opt' onClick={closeMenu}>⚙️ Manage Account</li></Link>
                      <li className='prof-opt' onClick={handleSubmit}><Link>🔑 Change Password</Link></li>
                      <li className='prof-logout'><Link to="/" className="logout" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
      <div className='body-content'>
      <Outlet />
      </div>
    </>
  )
};

export default Header;
