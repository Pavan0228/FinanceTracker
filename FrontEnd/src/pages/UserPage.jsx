import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/authSlice';
import axios from 'axios';
import { Upload, User, Camera } from 'lucide-react';

function UserPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem("uid"); // Fetch userId from localStorage

    useEffect(() => {
        if (userId) {
            dispatch(getUser({ userId }))
                .then(user => setUserData(user))
                .catch(console.error);
        }
    }, [dispatch, userId]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('userId', userId); // Include userId in the form data

        try {
            const response = await axios.post(`${API_URL}/api/upload/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url);
            setIsUploading(false);
        } catch (error) {
            console.error(error);
            alert('Upload failed');
            setIsUploading(false);
        }
    };

    // Generate initials for the avatar if no image is available
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-100">Profile Settings</h2>

                <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Profile Image Section */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="relative group">
                                {(imageUrl || previewUrl || userData?.payload?.profile) ? (
                                    <img
                                        src={previewUrl || imageUrl || userData?.payload?.profile}
                                        alt="Profile"
                                        className="w-48 h-48 rounded-full object-cover border-4 border-orange-400"
                                    />
                                ) : (
                                    <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                                        <span className="text-4xl font-bold">{getInitials(userData?.payload?.name)}</span>
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-gray-700 p-3 rounded-full cursor-pointer
                                    hover:bg-gray-600 transition-all duration-300 shadow-lg">
                                    <Camera className="w-6 h-6" />
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            {selectedFile && !imageUrl && (
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                                        disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg 
                                        transition-all duration-300"
                                >
                                    <Upload className="w-5 h-5" />
                                    {isUploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            )}
                        </div>

                        {/* User Details Section */}
                        <div className="w-full md:w-2/3 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Full Name</label>
                                        <div className="px-4 py-3 bg-gray-700 rounded-lg">
                                            {userData?.payload?.name || 'Not set'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Email Address</label>
                                        <div className="px-4 py-3 bg-gray-700 rounded-lg">
                                            {userData?.payload?.email || 'Not set'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Profession</label>
                                        <div className="px-4 py-3 bg-gray-700 rounded-lg">
                                            {userData?.payload?.profession || 'Not set'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
