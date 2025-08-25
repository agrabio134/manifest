import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import Swal from 'sweetalert2';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIKzn1sIdbeOZ4a_sid6tuMhFU0Hl6pJM",
  authDomain: "manifest-ca39f.firebaseapp.com",
  projectId: "manifest-ca39f",
  storageBucket: "manifest-ca39f.firebasestorage.app",
  messagingSenderId: "1046557125973",
  appId: "1:1046557125973:web:5c082aee1ff35d24fb53dc",
  measurementId: "G-Y4V48EEJ8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Categories = ({ addToCart }) => {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('manifest-cars');
  const [activeCarBrand, setActiveCarBrand] = useState('porsche');
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customDreams, setCustomDreams] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sign in anonymously on mount
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error('Anonymous auth failed:', error);
    });
  }, []);

  // Fetch custom dreams when wallet address changes
  useEffect(() => {
    const fetchCustomDreams = async () => {
      if (wallet.connected && wallet.address) {
        try {
          const dreamsRef = collection(db, `users/${wallet.address}/customDreams`);
          const snapshot = await getDocs(dreamsRef);
          const dreams = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCustomDreams(dreams);
        } catch (error) {
          console.error('Failed to fetch custom dreams:', error);
        }
      } else {
        setCustomDreams([]);
      }
    };
    fetchCustomDreams();
  }, [wallet.connected, wallet.address]);

  const openTab = (tabName) => {
    setActiveTab(tabName);
    if (tabName !== 'manifest-cars') {
      setActiveCarBrand(null);
    } else {
      setActiveCarBrand('porsche');
    }
  };

  const openCarBrand = (brand) => {
    setActiveCarBrand(brand);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      Swal.fire({
        icon: 'error',
        title: 'Wallet Not Connected',
        text: 'Please connect your wallet to add a custom dream.',
      });
      return;
    }
    const price = parseFloat(customPrice);
    if (price < 10000) {
      Swal.fire({
        icon: 'error',
        title: 'Price Too Low',
        text: 'Custom dreams must be at least $10,000.',
      });
      return;
    }
    const result = await Swal.fire({
      title: 'Add Custom Dream',
      text: `Are you sure you want to add "${customName}" to your custom dreams?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#2a2a2a',
      cancelButtonColor: '#cccccc',
    });
    if (!result.isConfirmed) {
      return;
    }
    try {
      const dreamsRef = collection(db, `users/${wallet.address}/customDreams`);
      await addDoc(dreamsRef, {
        name: customName,
        description: customDescription,
        price,
        image: customImage || '',
        createdAt: new Date().toISOString(),
      });
      Swal.fire({
        icon: 'success',
        title: 'Custom Dream Added!',
        text: `${customName} has been saved.`,
        showConfirmButton: false,
        timer: 1500,
      });
      const snapshot = await getDocs(dreamsRef);
      setCustomDreams(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCustomName('');
      setCustomDescription('');
      setCustomPrice('');
      setCustomImage('');
    } catch (error) {
      console.error('Failed to add custom dream:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add custom dream.',
      });
    }
  };

  const handleRemoveDream = async (dreamId, dreamName) => {
    if (!wallet.connected || !wallet.address) {
      Swal.fire({
        icon: 'error',
        title: 'Wallet Not Connected',
        text: 'Please connect your wallet to remove a dream.',
      });
      return;
    }
    try {
      const dreamRef = doc(db, `users/${wallet.address}/customDreams`, dreamId);
      await deleteDoc(dreamRef);
      Swal.fire({
        icon: 'info',
        title: 'Dream Removed!',
        text: `${dreamName} has been removed.`,
        showConfirmButton: false,
        timer: 1500,
      });
      setCustomDreams(customDreams.filter((dream) => dream.id !== dreamId));
    } catch (error) {
      console.error('Failed to remove custom dream:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove custom dream.',
      });
    }
  };

  const categories = [
    {
      id: 'manifest-cars',
      name: 'Manifest Cars',
      brands: [
        {
          id: 'porsche',
          name: 'Porsche',
          logo: '/Porsche-Logo.png',
          items: [
            {
              name: 'Porsche Taycan',
              image: 'https://porsche.imgix.net/-/media/8C6531BC02634587B55773A4516CC6ED_53BD8ACEBA3D401D9E3550716D550608_02---J1?h=2880&iar=0&w=600&ar=4%3A3&q=80&crop=faces%2Centropy%2Cedges&auto=format',
              description: 'Manifest an electric icon with cutting-edge innovation.',
              price: 185000,
            },
            {
              name: 'Porsche 911 Carrera S',
              image: 'https://porsche.imgix.net/-/media/273AFC7BD62849B688BF7377B02F32C0_3500C06DE4384AC88205537528AC3B66_01---911-Carrera-S---New?h=2880&iar=0&w=600&ar=4%3A3&q=80&crop=faces%2Centropy%2Cedges&auto=format',
              description: 'Manifest a timeless legend with dynamic precision.',
              price: 130000,
            },
            {
              name: 'Panamera 4S E-Hybrid',
              image: 'https://porsche.imgix.net/-/media/16E076F66D2F4FE2985B8FAA6CCC7FEC_2C14F0621AA240F49AA4740B2CD5FFB1_01---G3-4S-PHEV?h=2880&iar=0&w=600&ar=4%3A3&q=80&crop=faces%2Centropy%2Cedges&auto=format',
              description: 'Manifest a hybrid masterpiece with luxurious finesse.',
              price: 115000,
            },
          ],
        },
        {
          id: 'lamborghini',
          name: 'Lamborghini',
          logo: '/Lamborghini_Logo.png',
          items: [
            {
              name: 'Lamborghini Revuelto',
              image: 'https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2025/06/mansory-lamborghini-revuelto-hollman-international-02.png?q=49&fit=crop&w=360&h=240&dpr=2',
              description: 'Manifest the pinnacle of hybrid supercar performance.',
              price: 600000,
            },
            {
              name: 'Lamborghini Aventador',
              image: 'https://hips.hearstapps.com/hmg-prod/images/2022-lamborghini-aventador-109-1625607587.jpg?crop=0.750xw:0.632xh;0.183xw,0.233xh&resize=2048:*',
              description: 'Manifest raw power and iconic design.',
              price: 500000,
            },
            {
              name: 'Lamborghini Gallardo',
              image: 'https://m.atcdn.co.uk/vms/media/%7Bresize%7D/d0d9171a611d441db3dd48621227c574.jpg',
              description: 'Manifest classic Lamborghini agility and style.',
              price: 200000,
            },
          ],
        },
        {
          id: 'rolls-royce',
          name: 'Rolls-Royce',
          logo: '/Rolls-royce.png',
          items: [
            {
              name: 'Rolls-Royce Phantom',
              image: 'https://media.ed.edmunds-media.com/rolls-royce/phantom/2025/ot/2025_rolls-royce_phantom_f34_ot_32025_1280.jpg',
              description: 'Manifest the epitome of luxury and craftsmanship.',
              price: 550000,
            },
            {
              name: 'Rolls-Royce Cullinan',
              image: 'https://www.rolls-roycemotorcarsphiladelphia.com/imagetag/16180/2/l/New-2024-Rolls-Royce-Cullinan.jpg',
              description: 'Manifest opulent SUV elegance.',
              price: 471900,
            },
            {
              name: 'Rolls-Royce Spectre',
              image: 'https://www.topgear.com/sites/default/files/cars-car/image/2023/07/LIPMAN_JL93884_0.jpg?w=1280&h=720',
              description: 'Manifest the future of electric luxury.',
              price: 420000,
            },
          ],
        },
        {
          id: 'bugatti',
          name: 'Bugatti',
          logo: '/Bugatti_logo.png',
          items: [
            {
              name: 'Bugatti Chiron',
              image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Bugatti/Chiron/8451/1633582433934/front-left-side-47.jpg',
              description: 'Manifest hypercar supremacy.',
              price: 3000000,
            },
            {
              name: 'Bugatti Veyron',
              image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Bugatti/Bugatti-Veyron/1340/1559125026509/front-left-side-47.jpg',
              description: 'Manifest legendary speed.',
              price: 2000000,
            },
            {
              name: 'Bugatti Divo',
              image: 'https://images.topgear.com.ph/topgear/images/2020/08/28/bugatti-divo-review-01-1598611794.jpg',
              description: 'Manifest track-focused exclusivity.',
              price: 5800000,
            },
          ],
        },
      ],
    },
    {
      id: 'manifest-houses',
      name: 'Manifest Homes',
      items: [
        {
          name: 'Manifest Mansion',
          image: 'https://d1dxs113ar9ebd.cloudfront.net/225batonrouge/2022/08/mansion_with_pond_at_night-scaled.jpeg',
          description: 'Manifest a grand estate with $MANIFEST opulence.',
          price: 10000000,
        },
        {
          name: 'Manifest Beach Retreat',
          image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/e4/b3/e9/jafferji-beach-retreat.jpg?w=1200&h=-1&s=1',
          description: 'Manifest a seaside sanctuary with $MANIFEST elegance.',
          price: 8500000,
        },
        {
          name: 'Manifest Sky Loft',
          image: 'https://www.thepinnaclelist.com/wp-content/uploads/2014/10/29-Sky-Lofts-Glasshouse-Penthouse-New-York-NY-USA-1024x674.jpg',
          description: 'Manifest a penthouse with breathtaking views via $MANIFEST.',
          price: 15000000,
        },
      ],
    },
    {
      id: 'manifest-watches',
      name: 'Manifest Timepieces',
      items: [
        {
          name: 'Manifest ROLEX',
          image: 'https://watchexchange.sg/wp-content/uploads/2023/11/most-expensive-rolex-.jpg',
          description: 'Manifest a horological icon with $MANIFEST prestige.',
          price: 50000,
        },
        {
          name: 'Manifest Heritage Watch',
          image: 'https://cdn.shopify.com/s/files/1/0182/8937/files/JLC_MGT_Gyrotourbillon_3_1_1024x1024.png?v=1584272467',
          description: 'Manifest a legacy timepiece with $MANIFEST elegance.',
          price: 75000,
        },
      ],
    },
    {
      id: 'manifest-travel',
      name: 'Manifest Journeys',
      items: [
        {
          name: 'Manifest Private Jet',
          image: 'https://www.zephyrjets.com/wp-content/uploads/2017/07/bigstock-Private-jet-on-the-runway-with-106065998.jpg',
          description: 'Manifest a luxurious flight with $MANIFEST exclusivity.',
          price: 100000,
        },
        {
          name: 'Manifest Yacht Voyage',
          image: 'https://www.charterworld.com/news/wp-content/uploads/2016/05/Luxury-Charter-Yacht-REMEMBER-WHEN.jpg',
          description: 'Manifest a premium cruise with $MANIFEST splendor.',
          price: 200000,
        },
        {
          name: 'Manifest Island Escape',
          image: 'https://vexploretours.com/wp-content/uploads/2022/09/Island-Escape-Burasari-swimming-pool-Pool-bar.jpg',
          description: 'Manifest a private island retreat with $MANIFEST luxury.',
          price: 5000000,
        },
      ],
    },
    {
      id: 'custom-dreams',
      name: 'Custom Dreams',
    },
  ];

  return (
    <section className="categories" id="dreams">
      {isMobile ? (
        <div className="filter-container">
          <select
            value={activeTab}
            onChange={(e) => openTab(e.target.value)}
            className="category-filter"
            aria-label="Select category"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {activeTab === 'manifest-cars' && (
            <select
              value={activeCarBrand}
              onChange={(e) => openCarBrand(e.target.value)}
              className="brand-filter"
              aria-label="Select car brand"
            >
              {categories
                .find((cat) => cat.id === 'manifest-cars')
                .brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      ) : (
        <div className="tab-buttons">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`tab-btn ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => openTab(category.id)}
              aria-label={`View ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
      {categories.map((category) => (
        <div key={category.id} id={category.id} className={`tab-content ${activeTab === category.id ? 'active' : ''}`}>
          {category.id === 'manifest-cars' && (
            <>
              {!isMobile && (
                <div className="tab-buttons car-brands">
                  {category.brands.map((brand) => (
                    <button
                      key={brand.id}
                      className={`tab-btn ${activeCarBrand === brand.id ? 'active' : ''}`}
                      onClick={() => openCarBrand(brand.id)}
                      aria-label={`View ${brand.name} cars`}
                    >
                      <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
                      {brand.name}
                    </button>
                  ))}
                </div>
              )}
              {category.brands.map((brand) => (
                <div key={brand.id} className={`tab-content ${activeCarBrand === brand.id ? 'active' : ''}`}>
                  <div className="brand-logo-container">
                    <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo-large" />
                  </div>
                  <div className="dream-showcase">
                    {brand.items.map((item, index) => (
                      <div key={index} className="dream-item fade-in">
                        <img src={item.image} alt={item.name} />
                        <div className="dream-item-content">
                          <h3>{item.name}</h3>
                          <p className="description">{item.description}</p>
                          <p className="price">${item.price.toLocaleString()}</p>
                          <a
                            href="#"
                            className="add-to-cart"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(item.name, item.price, item.description, item.image);
                            }}
                            aria-label={`Add ${item.name} to cart`}
                          >
                            Add to Manifest Cart
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
          {category.id !== 'manifest-cars' && category.id !== 'custom-dreams' && (
            <div className="dream-showcase">
              {category.items.map((item, index) => (
                <div key={index} className="dream-item fade-in">
                  <img src={item.image} alt={item.name} />
                  <div className="dream-item-content">
                    <h3>{item.name}</h3>
                    <p className="description">{item.description}</p>
                    <p className="price">${item.price.toLocaleString()}</p>
                    <a
                      href="#"
                      className="add-to-cart"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(item.name, item.price, item.description, item.image);
                      }}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      Add to Manifest Cart
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category.id === 'custom-dreams' && (
            <div className="custom-dream-section">
              <h3>Create Your Custom Dream</h3>
              <form className="custom-dream-form" onSubmit={handleCustomSubmit}>
                <input
                  type="text"
                  placeholder="Dream Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                  aria-label="Custom dream name"
                />
                <textarea
                  placeholder="Description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  required
                  aria-label="Custom dream description"
                ></textarea>
                <input
                  type="number"
                  placeholder="Price (min $10,000)"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  required
                  aria-label="Custom dream price"
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  aria-label="Custom dream image URL"
                />
                <button type="submit" aria-label="Add custom dream">Add Custom Dream</button>
              </form>
              {!wallet.connected ? (
                <p className="connect-wallet-text">Connect your wallet to view and manage your custom dreams.</p>
              ) : (
                <>
                  <h3>Your Custom Dreams</h3>
                  <div className="dream-showcase">
                    {customDreams.length === 0 ? (
                      <p>No custom dreams added yet.</p>
                    ) : (
                      customDreams.map((dream) => (
                        <div key={dream.id} className="dream-item fade-in">
                          <img src={dream.image || 'https://via.placeholder.com/350'} alt={dream.name} />
                          <div className="dream-item-content">
                            <h3>{dream.name}</h3>
                            <p className="description">{dream.description}</p>
                            <p className="price">${dream.price.toLocaleString()}</p>
                            <div className="dream-actions">
                              <a
                                href="#"
                                className="add-to-cart"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(dream.name, dream.price, dream.description, dream.image);
                                }}
                                aria-label={`Add ${dream.name} to cart`}
                              >
                                Add to Cart
                              </a>
                              <button
                                className="remove-dream"
                                onClick={() => handleRemoveDream(dream.id, dream.name)}
                                aria-label={`Remove ${dream.name} from custom dreams`}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
              <p className="suggestion-text">
                Your Dream Car Brand is not here?{' '}
                <a href="https://t.me/manifestsui" target="_blank" rel="noopener noreferrer">
                  Suggest it here
                </a>
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Categories;