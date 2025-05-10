import React, { useState } from 'react';
    import axios from 'axios';
    import { Check, X, User, Home, MessageSquare, CalendarDays, Phone, MapPin } from 'lucide-react'; // Icons

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    // onUpdate: Callback function to notify parent when status is updated
    const ApplicationReviewCard = ({ application, onUpdate }) => {
        const [shelterNotes, setShelterNotes] = useState(application.shelterNotes || '');
        const [isUpdating, setIsUpdating] = useState(false);
        const [updateError, setUpdateError] = useState('');
        const token = localStorage.getItem('authToken');

        const handleStatusUpdate = async (newStatus) => {
            if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) {
                return;
            }

            setIsUpdating(true);
            setUpdateError('');
            if (!token) {
                setUpdateError("Authentication token missing.");
                setIsUpdating(false);
                return;
            }

            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const payload = { status: newStatus, shelterNotes };
                const response = await axios.put(`${API_URL}/applications/${application.id}/status`, payload, config);

                // Notify parent component of the successful update
                if (onUpdate && typeof onUpdate === 'function') {
                    onUpdate(response.data); // Pass the updated application data back
                }

            } catch (err) {
                console.error(`Error ${newStatus.toLowerCase()}ing application:`, err);
                setUpdateError(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} application.`);
            } finally {
                setIsUpdating(false);
            }
        };

        // Helper for status badge styles
        const getStatusBadgeStyles = (status) => {
            switch (status) {
              case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
              case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
              case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
              case 'Withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
              default: return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        };

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString();
        };

        return (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 space-y-4">
                {/* Header: Pet & Applicant Info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={application.Pet?.imageUrl || '/images/placeholder-image.svg'}
                            alt={application.Pet?.name || 'Pet'}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-teal-600">{application.Pet?.name || 'Unknown Pet'}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <User size={14} /> Applicant: {application.applicant?.name || 'Unknown'} ({application.applicant?.email || 'N/A'})
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 text-right flex-shrink-0">
                        <p className="flex items-center justify-end gap-1"><CalendarDays size={14} /> Applied: {formatDate(application.createdAt)}</p>
                        <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(application.status)}`}>
                            {application.status}
                        </span>
                    </div>
                </div>

                {/* Application Details */}
                {application.applicantMessage && (
                    <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1 flex items-center gap-1"><MessageSquare size={15}/> Applicant Message:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{application.applicantMessage}</p>
                    </div>
                )}
                {application.homeEnvironment && (
                     <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1 flex items-center gap-1"><Home size={15}/> Home Environment:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{application.homeEnvironment}</p>
                    </div>
                )}
                {/* Display Phone Number */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1 flex items-center gap-1"><Phone size={15}/> Phone Number:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">{application.applicant?.phone || 'N/A'}</p>
                </div>
                {/* Display Address */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1 flex items-center gap-1"><MapPin size={15}/> Address:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{application.applicant?.address || 'N/A'}</p>
                </div>

                {/* Shelter Actions (Only for Pending) */}
                {application.status === 'Pending' && (
                    <div className="border-t pt-4 space-y-3">
                        <div>
                            <label htmlFor={`notes-${application.id}`} className="block text-sm font-medium text-gray-700 mb-1">Shelter Notes (Optional)</label>
                            <textarea
                                id={`notes-${application.id}`}
                                value={shelterNotes}
                                onChange={(e) => setShelterNotes(e.target.value)}
                                rows="2"
                                placeholder="Add notes regarding your decision..."
                                className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                        {updateError && <p className="text-xs text-red-600">{updateError}</p>}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handleStatusUpdate('Approved')}
                                disabled={isUpdating}
                                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={16} /> Approve
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Rejected')}
                                disabled={isUpdating}
                                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </div>
                )}

                {/* Display Shelter Notes if Approved/Rejected */}
                {application.status !== 'Pending' && application.shelterNotes && (
                     <div className="border-t pt-3">
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Shelter Notes:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{application.shelterNotes}</p>
                        <p className="text-xs text-gray-500 mt-1">Decision Date: {formatDate(application.decisionDate)}</p>
                    </div>
                )}
            </div>
        );
    };

    export default ApplicationReviewCard;
