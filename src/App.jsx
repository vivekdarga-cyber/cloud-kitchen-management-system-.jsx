import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, LogOut, User, ChefHat, Package } from 'lucide-react';

const CloudKitchenSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '', isAdmin: false });
  const [newRecipe, setNewRecipe] = useState({ name: '', description: '', price: '', image: null });
  const [adminTab, setAdminTab] = useState('recipes');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    setRecipes([]);
  }, []);

  const handleLogin = () => {
    if (loginForm.username && loginForm.password) {
      setCurrentUser({
        username: loginForm.username,
        isAdmin: loginForm.isAdmin
      });
      setView(loginForm.isAdmin ? 'admin' : 'user');
      setLoginForm({ username: '', password: '', isAdmin: false });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setView('login');
  };

  const addToCart = (recipe) => {
    const existing = cart.find(item => item.id === recipe.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === recipe.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...recipe, quantity: 1 }]);
    }
  };

  const removeFromCart = (recipeId) => {
    setCart(cart.filter(item => item.id !== recipeId));
  };

  const updateQuantity = (recipeId, change) => {
    setCart(cart.map(item => {
      if (item.id === recipeId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const order = {
      id: orders.length + 1,
      user: currentUser.username,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    
    setOrders([...orders, order]);
    setCart([]);
    alert('Order placed successfully!');
  };

  const addRecipe = () => {
    if (newRecipe.name && newRecipe.price && newRecipe.image) {
      const recipe = {
        id: Date.now(),
        name: newRecipe.name,
        description: newRecipe.description,
        price: parseFloat(newRecipe.price),
        image: newRecipe.image
      };
      setRecipes([...recipes, recipe]);
      setNewRecipe({ name: '', description: '', price: '', image: null });
      setImagePreview('');
      alert('Recipe added successfully!');
    } else {
      alert('Please fill all required fields including image!');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        if (imageData) {
          setNewRecipe({...newRecipe, image: imageData});
          setImagePreview(imageData);
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const deleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(recipes.filter(r => r.id !== recipeId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return null;
};

export default CloudKitchenSystem;
