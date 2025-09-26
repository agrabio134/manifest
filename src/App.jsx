import { useState, useEffect } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import Swal from 'sweetalert2';
import Header from './components/Header';
import Nav from './components/Nav';
import About from './components/About';
import Categories from './components/Categories';
import Cart from './components/Cart';
import Insights from './components/Insights';
import Footer from './components/Footer';

function AppContent() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('manifestCart')) || []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [hideHamburger, setHideHamburger] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Fetch token price
  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0xc466c28d87b3d5cd34f3d5c088751532d71a38d93a8aae4551dd56272cfb4355::manifest::MANIFEST');
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          setTokenPrice(data.pairs[0].priceUsd);
        }
      } catch (error) {
        console.error('Failed to fetch token price:', error);
      }
    };
    fetchTokenPrice();
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideHamburger(true);
      } else {
        setHideHamburger(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const addToCart = (itemName, itemPrice, itemDescription = '', itemImage = '', shouldOpenCart = false) => {
    console.log('addToCart called with:', { itemName, itemPrice, itemDescription, itemImage, shouldOpenCart });
    const newCart = [...cart, { name: itemName, price: itemPrice, description: itemDescription, image: itemImage }];
    setCart(newCart);
    localStorage.setItem('manifestCart', JSON.stringify(newCart));
    Swal.fire({
      icon: 'success',
      title: 'Added to Manifest Cart!',
      text: `${itemName} has been added.`,
      showConfirmButton: false,
      timer: 1500,
    });
    if (shouldOpenCart) {
      setTimeout(() => {
        console.log('Opening cart, setting isCartOpen to true');
        setIsCartOpen(true);
        if (isNavOpen) {
          console.log('Closing nav, setting isNavOpen to false');
          setIsNavOpen(false);
        }
      }, 100);
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('manifestCart', JSON.stringify(newCart));
    Swal.fire({
      icon: 'info',
      title: 'Removed from Cart!',
      text: 'Item has been removed.',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const toggleCart = () => {
    console.log('Toggling cart, current isCartOpen:', isCartOpen);
    setIsCartOpen(!isCartOpen);
    if (isNavOpen) setIsNavOpen(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  return (
    <>
  <Nav toggleCart={toggleCart} isNavOpen={isNavOpen} toggleNav={toggleNav} hideHamburger={hideHamburger} />
      <Header />
      <About />
      <Categories addToCart={addToCart} />
      <Cart cart={cart} removeFromCart={removeFromCart} isCartOpen={isCartOpen} toggleCart={toggleCart} tokenPrice={tokenPrice} />
      <Insights />
      <Footer />
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;