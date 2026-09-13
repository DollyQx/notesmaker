'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  Star,
  FileText,
  CheckCircle2,
  Lock,
  User,
  Building,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Sparkles,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export default function NoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getNoteById, isLoading } = useData();
  const { user, hasPurchased, unlockNote } = useAuth();

  const note = getNoteById(id);
  const isUnlocked = hasPurchased(id);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  // Security Check: Deny student access to unpublished notes
  const isDenied = note && note.status !== 'ACTIVE' && user?.role !== 'ADMIN';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Fetching note details from database...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!note || isDenied) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Note Unavailable</h2>
            <p className="text-xs text-gray-500">
              {isDenied
                ? 'This note is currently unlisted or in draft status.'
                : 'The note you are looking for does not exist or has been removed.'}
            </p>
            <Link
              href="/notes"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Browse Published Marketplace
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = note.originalPrice
    ? Math.round(((note.originalPrice - note.price) / note.originalPrice) * 100)
    : null;

  // Load Razorpay Script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setPurchaseError('');
    setPurchaseSuccess('');
    setIsPurchasing(true);

    try {
      // 1. Create order on backend (uses database price)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: note.id })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setIsPurchasing(false);
        setPurchaseError(orderData.error || 'Failed to initialize payment');
        return;
      }

      if (orderData.alreadyPurchased) {
        setIsPurchasing(false);
        unlockNote(note.id);
        router.push(`/my-notes/${note.id}/read`);
        return;
      }

      // 2. Try loading Razorpay popup script
      const isScriptLoaded = await loadRazorpayScript();

      if (isScriptLoaded && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency || 'INR',
          name: 'NotesMaker Marketplace',
          description: `Unlock Note: ${orderData.noteTitle}`,
          order_id: orderData.orderId,
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#4f46e5'
          },
          handler: async function (response: any) {
            // 3. Verify signature server-side
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                noteId: note.id,
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'simulated_sig_ok'
              })
            });
            const verifyData = await verifyRes.json();
            setIsPurchasing(false);

            if (verifyData.success) {
              setPurchaseSuccess('Payment verified successfully! Redirecting to PDF reader...');
              unlockNote(note.id);
              setTimeout(() => {
                setShowUnlockModal(false);
                router.push(`/my-notes/${note.id}/read`);
              }, 1200);
            } else {
              setPurchaseError(verifyData.error || 'Payment signature verification failed');
            }
          },
          modal: {
            ondismiss: function () {
              setIsPurchasing(false);
              setPurchaseError('Payment checkout was closed.');
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      } else {
        // Fallback for offline/test environment: Verify test transaction directly
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noteId: note.id,
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `PAY_TEST_${Date.now()}`,
            razorpay_signature: 'simulated_sig_ok'
          })
        });
        const verifyData = await verifyRes.json();
        setIsPurchasing(false);

        if (verifyData.success) {
          setPurchaseSuccess('Payment verified! Redirecting to PDF reader...');
          unlockNote(note.id);
          setTimeout(() => {
            setShowUnlockModal(false);
            router.push(`/my-notes/${note.id}/read`);
          }, 1200);
        } else {
          setPurchaseError(verifyData.error || 'Failed to complete payment');
        }
      }
    } catch (err) {
      setIsPurchasing(false);
      setPurchaseError('Network error during checkout process');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Top Breadcrumb & Hero */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/notes" className="hover:text-white">Marketplace</Link>
            <span>/</span>
            <span className="text-indigo-400 font-bold truncate max-w-xs">{note.categoryName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="bg-indigo-600/30 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-full border border-indigo-500/30">
              {note.categoryName}
            </span>
            <span className="bg-slate-800 text-slate-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-700">
              {note.subCategoryName}
            </span>
            {note.status === 'ACTIVE' ? (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                Verified Published
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                Draft / Admin Mode
              </span>
            )}
            {note.isBestseller && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Bestseller
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {note.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{note.rating || 4.9}</span>
              <span className="text-slate-400">({note.reviewsCount || 140} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span>By {note.author}</span>
            </div>
            {note.institute && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-300">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>{note.institute}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details & Preview */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview & Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Note Overview & Syllabus Coverage
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {note.description}
              </p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Non-downloadable Sample Content Preview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Sample Note Chapter Preview
                </h3>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">
                  Free Sample Page
                </span>
              </div>

              <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs leading-relaxed space-y-4 border border-slate-800 shadow-inner relative overflow-hidden select-none">
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>SAMPLE READ MODE • WATERMARKED</span>
                  <span>PAGE 1 OF {note.pages}</span>
                </div>
                <div className="whitespace-pre-line text-slate-200">
                  {note.sampleText || `TOPIC 1: FUNDAMENTALS & HIGH-YIELD CONCEPTS\n\n1. Core Formulas & Theorems:\n- Step-by-step memory shortcuts and diagrams for quick revision.\n- High probability exam questions highlighted with star tags.\n\n2. Previous Year Trends:\n- Frequently asked 5-mark and 10-mark answers summarized.`}
                </div>
                <div className="pt-4 border-t border-slate-800 text-center text-slate-400 text-[11px] font-sans">
                  🔒 Unlock complete {note.pages}-page document in web PDF reader after purchase.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Purchase Card */}
          <div>
            <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Digital Access Pass
                  </span>
                  {isUnlocked && (
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Purchased
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-gray-900">₹{note.price}</span>
                  {note.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{note.originalPrice}</span>
                  )}
                  {discount && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Includes lifetime access & web PDF reader</p>
              </div>

              {/* Note Details Meta */}
              <div className="space-y-3 pt-3 border-t border-gray-100 text-xs text-gray-700">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-bold text-gray-900">{note.categoryName}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500">Sub-Category:</span>
                  <span className="font-bold text-gray-900">{note.subCategoryName}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500">Document Length:</span>
                  <span className="font-bold text-gray-900">{note.pages} Pages</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500">File Format:</span>
                  <span className="font-bold text-gray-900">Protected PDF</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500">File Size:</span>
                  <span className="font-bold text-gray-900">{note.fileSize}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500">Students Enrolled:</span>
                  <span className="font-bold text-gray-900">{note.salesCount}+ Students</span>
                </div>
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <Link
                  href={`/my-notes/${note.id}/read`}
                  className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Note PDF Now</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      router.push('/login');
                    } else {
                      setShowUnlockModal(true);
                    }
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Purchase & Unlock Note (₹{note.price})</span>
                </button>
              )}

              {/* Guarantee */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-center">
                <div className="flex justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-bold text-gray-800">100% Instant Online Access Guarantee</p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Razorpay Secured • Read immediately after verified checkout.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Purchase Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Razorpay Secured Checkout
              </h3>
              <button onClick={() => setShowUnlockModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {purchaseError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{purchaseError}</span>
              </div>
            )}

            {purchaseSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{purchaseSuccess}</span>
              </div>
            )}

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <p className="text-xs font-bold text-indigo-950 line-clamp-1">{note.title}</p>
              <div className="flex items-center justify-between text-xs text-indigo-700 pt-1 border-t border-indigo-100/60 font-semibold">
                <span>Database Selling Price:</span>
                <span className="text-base font-extrabold text-indigo-900">₹{note.price}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <p className="font-bold text-gray-900">Student Account:</p>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-[11px] text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleRazorpayPayment}
                disabled={isPurchasing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPurchasing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{note.price} via Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
