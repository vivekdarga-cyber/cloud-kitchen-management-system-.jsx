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

  // Initialize with empty recipes - admin will add them
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

  // Login Page
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <ChefHat className="w-16 h-16 mx-auto text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Cloud Kitchen</h1>
            <p className="text-gray-600 mt-2">Management System</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={loginForm.isAdmin}
                onChange={(e) => setLoginForm({...loginForm, isAdmin: e.target.checked})}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 text-sm text-gray-700">
                Login as Admin
              </label>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Login
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo: Use any username/password</p>
          </div>
        </div>
      </div>
    );
  }

  // User View
  if (view === 'user') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-orange-500 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Cloud Kitchen</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-500">₹{recipe.price}</span>
                      <button
                        onClick={() => addToCart(recipe)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                </div>
                
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div>
                    <div className="space-y-3 mb-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-sm text-gray-600">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">₹{(item.price * item.quantity)}</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-orange-500">
                          ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                        </span>
                      </div>
                      <button
                        onClick={placeOrder}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-bold"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-orange-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAdminTab('recipes')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                adminTab === 'recipes' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Manage Recipes
            </button>
            <button
              onClick={() => setAdminTab('orders')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                adminTab === 'orders' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              View Orders ({orders.length})
            </button>
          </div>

          {adminTab === 'recipes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Recipe</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
                    <input
                      type="text"
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Butter Chicken"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newRecipe.description}
                      onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your dish..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={newRecipe.price}
                      onChange={(e) => setNewRecipe({...newRecipe, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="299"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg" />
                    )}
                  </div>
                  
                  <button
                    onClick={addRecipe}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recipe
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Current Menu ({recipes.length} items)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <img src={recipe.image} alt={recipe.name} className="w-20 h-20 object-cover rounded-lg" />
                        <button
                          onClick={() => deleteRecipe(recipe.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{recipe.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
                      <p className="text-xl font-bold text-orange-500">₹{recipe.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Orders</h3>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600">Customer: {order.user}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-500">₹{order.total}</p>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`mt-2 px-3 py-1 rounded-lg text-sm font-medium ${
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Ready' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <h5 className="font-medium text-gray-700 mb-2">Items:</h5>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex justify-between">
                              <span>{item.name} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CloudKitchenSystem;
