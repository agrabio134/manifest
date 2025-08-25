import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import Swal from 'sweetalert2';

const TOKEN_TYPE = '0xc466c28d87b3d5cd34f3d5c088751532d71a38d93a8aae4551dd56272cfb4355::manifest::MANIFEST';
const DECIMALS = 9;

const Cart = ({ cart, removeFromCart, isCartOpen, toggleCart, tokenPrice }) => {
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const usdBalance = balance * tokenPrice;
  const progress = total > 0 ? Math.min((usdBalance / total) * 100, 100) : 0;

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.connected && wallet.address) {
        const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
        try {
          const { totalBalance } = await client.getBalance({
            owner: wallet.address,
            coinType: TOKEN_TYPE,
          });
          setBalance(Number(totalBalance) / 10 ** DECIMALS);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };
    fetchBalance();
  }, [wallet.connected, wallet.address]);

  const generateProgressImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Porsche Next"';
    ctx.textAlign = 'center';
    ctx.fillText('Your Dream Progress', canvas.width / 2, 50);

    ctx.fillStyle = '#cccccc';
    ctx.font = '18px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Your Dreams:', 50, 100);
    const maxItems = Math.min(cart.length, 5);
    for (let i = 0; i < maxItems; i++) {
      const item = cart[i];
      const text = `${item.name}: $${item.price.toLocaleString()}`;
      ctx.fillText(text, 50, 130 + i * 30);
    }
    if (cart.length > 5) {
      ctx.fillText(`...and ${cart.length - 5} more`, 50, 130 + maxItems * 30);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Cart Total: $${total.toLocaleString()}`, canvas.width / 2, 300);

    ctx.fillText(`Balance: ${balance.toLocaleString()} $MANIFEST (~$${usdBalance.toLocaleString()})`, canvas.width / 2, 340);

    ctx.font = 'bold 32px Inter';
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`Progress: ${progress.toFixed(2)}%`, canvas.width / 2, 390);

    ctx.fillStyle = '#333333';
    ctx.fillRect(50, 420, 500, 30);

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(50, 420, (500 * progress) / 100, 30);

    ctx.fillStyle = '#cccccc';
    ctx.font = '16px Inter';
    ctx.textAlign = 'left';
    const walletText = wallet.connected ? `Wallet: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Wallet: Not Connected';
    ctx.fillText(walletText, 50, 480);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'italic 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Manifest Your Dreams with $MANIFEST', canvas.width / 2, 550);

    Swal.fire({
      title: 'Your Progress Image',
      html: `
        <img src="${canvas.toDataURL('image/png')}" style="width: 100%; max-width: 400px; border-radius: 8px;" />
        <p style="margin-top: 10px;">Share your dream progress on X!</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Download',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'progress-modal',
        confirmButton: 'modal-download-btn',
        cancelButton: 'modal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const link = document.createElement('a');
        link.download = 'dream-progress.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    });
  };

  return (
    <div className={`cart ${isCartOpen ? 'active' : ''}`}>
      <button className="cart-toggle" onClick={toggleCart}>
        <i className="fas fa-times"></i>
      </button>
      <h2>Manifest Cart</h2>
      <ul id="cart-items">
        {cart.map((item, index) => (
          <li key={index}>
            <span>{item.name}</span>
            <span className="price">${item.price.toLocaleString()}</span>
            <button onClick={() => removeFromCart(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        Total: $<span id="cart-total">{total.toLocaleString()}</span>
      </div>
      {!wallet.connected ? (
        <button onClick={() => wallet.connect()} className="connect-btn">
          Connect Wallet to See Progress
        </button>
      ) : (
        <>
          <div>Wallet Balance: {balance.toLocaleString()} $MANIFEST (~${usdBalance.toLocaleString()})</div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Progress: {progress.toFixed(2)}% to Achieve Dreams</p>
          </div>
          <button className="generate-progress-btn" onClick={generateProgressImage}>
            Share Progress on X
          </button>
        </>
      )}
      <a href="#" className="checkout-btn">
        <i className="fas fa-lock"></i> Checkout Locked
      </a>
    </div>
  );
};

export default Cart;