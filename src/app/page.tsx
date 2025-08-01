'use client';

import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share, Upload, Camera, Home, Users } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: number;
  user: { name: string; avatar: string };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags: string[];
  timestamp: string;
}

interface UploadData {
  image: string | null;
  caption: string;
  tags: string;
}

const ImagoApp = () => {
  const [currentTab, setCurrentTab] = useState('para-voce');
  const [user] = useState({ 
    name: 'Administrador', 
    avatar: '/api/placeholder/40/40',
    followers: 234,
    following: 189
  });
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: { name: 'Maria Santos', avatar: '/api/placeholder/40/40' },
      image: '/api/placeholder/400/300',
      caption: 'Um lindo pôr do sol na praia! 🌅',
      likes: 42,
      comments: 8,
      isLiked: false,
      tags: ['natureza', 'praia', 'sunset'],
      timestamp: '2h'
    },
    {
      id: 2,
      user: { name: 'Pedro Costa', avatar: '/api/placeholder/40/40' },
      image: '/api/placeholder/400/400',
      caption: 'Café da manhã perfeito ☕',
      likes: 18,
      comments: 3,
      isLiked: true,
      tags: ['comida', 'café', 'manhã'],
      timestamp: '4h'
    },
    {
      id: 3,
      user: { name: 'Ana Lima', avatar: '/api/placeholder/40/40' },
      image: '/api/placeholder/400/350',
      caption: 'Nova arte que criei hoje! 🎨',
      likes: 73,
      comments: 12,
      isLiked: false,
      tags: ['arte', 'criativo', 'pintura'],
      timestamp: '6h'
    }
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState<UploadData>({ image: null, caption: '', tags: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadData({ ...uploadData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (uploadData.image && uploadData.caption) {
      const newPost: Post = {
        id: posts.length + 1,
        user: { name: user.name, avatar: user.avatar },
        image: uploadData.image,
        caption: uploadData.caption,
        likes: 0,
        comments: 0,
        isLiked: false,
        tags: uploadData.tags.split(',').map(tag => tag.trim()),
        timestamp: 'agora'
      };
      setPosts([newPost, ...posts]);
      setUploadData({ image: null, caption: '', tags: '' });
      setShowUpload(false);
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Header do Post */}
      <div className="p-4 flex items-center space-x-3">
        <Image 
          src={post.user.avatar} 
          alt={post.user.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
          <p className="text-sm text-gray-500">{post.timestamp}</p>
        </div>
      </div>

      {/* Imagem */}
      <Image 
        src={post.image} 
        alt="Post"
        width={400}
        height={320}
        className="w-full h-80 object-cover bg-gray-200"
      />

      {/* Ações */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center space-x-1 transition-colors ${
              post.isLiked 
                ? 'text-pink-500' 
                : 'text-gray-600 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-600 hover:text-orange-400 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span>{post.comments}</span>
          </button>
          <button className="text-gray-600 hover:text-orange-400 transition-colors">
            <Share className="w-6 h-6" />
          </button>
        </div>

        {/* Caption */}
        <p className="text-gray-900 mb-2">{post.caption}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string, index: number) => (
            <span key={index} className="text-orange-500 text-sm hover:text-pink-500 cursor-pointer transition-colors">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Imago</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-orange-600 hover:to-pink-600 shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>Postar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <Image 
                  src={user.avatar} 
                  alt={user.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200"
                />
                <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{user.followers}</p>
                    <p className="text-sm text-gray-600">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{user.following}</p>
                    <p className="text-sm text-gray-600">Seguindo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button 
                  onClick={() => setCurrentTab('para-voce')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                    currentTab === 'para-voce' 
                      ? 'border-b-2 border-orange-500 text-orange-500' 
                      : 'text-gray-600 hover:text-orange-400'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Para Você</span>
                </button>
                <button 
                  onClick={() => setCurrentTab('seguindo')}
                  className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                    currentTab === 'seguindo' 
                      ? 'border-b-2 border-orange-500 text-orange-500' 
                      : 'text-gray-600 hover:text-orange-400'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Seguindo</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            <div>
              {currentTab === 'para-voce' && (
                <div>
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
              {currentTab === 'seguindo' && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Siga pessoas para ver seus posts aqui!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Criar Post</h3>
            
            {/* Upload de Imagem */}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              {uploadData.image ? (
                <Image 
                  src={uploadData.image} 
                  alt="Preview"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors"
                >
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Clique para adicionar uma imagem</p>
                  </div>
                </button>
              )}
            </div>

            {/* Caption */}
            <textarea
              placeholder="Escreva uma legenda..."
              value={uploadData.caption}
              onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none h-20"
            />

            {/* Tags */}
            <input
              type="text"
              placeholder="Tags (separadas por vírgula)"
              value={uploadData.tags}
              onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />

            {/* Botões */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitPost}
                disabled={!uploadData.image || !uploadData.caption}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 shadow-lg"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagoApp;