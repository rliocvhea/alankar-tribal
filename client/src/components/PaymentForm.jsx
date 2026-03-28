import { useEffect } from 'react';

function PaymentForm({ orderId, amount, onSuccess, onError }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = () => {
        if (!window.Razorpay) {
            alert('Razorpay SDK failed to load. Please check your internet connection.');
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount,
            currency: 'INR',
            name: 'E-Commerce Store',
            description: 'Order Payment',
            order_id: orderId,
            handler: function (response) {
                // Payment successful
                onSuccess(response);
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: {
                color: '#3b82f6'
            },
            modal: {
                ondismiss: function() {
                    onError('Payment cancelled by user');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
            onError(response.error.description);
        });
        razorpay.open();
    };

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={handlePayment}
                className="btn-primary w-full"
            >
                Pay with Razorpay
            </button>
            <p className="text-sm text-gray-500 text-center">
                Secure payment powered by Razorpay
            </p>
        </div>
    );
}

export default PaymentForm;