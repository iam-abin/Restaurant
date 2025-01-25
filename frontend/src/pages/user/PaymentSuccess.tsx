import { Link } from 'react-router';
import CheckmarkSvg from '../../assets/payment/paymentTick.gif';
import CustomButton from '../../components/Button/CustomButton';

const PaymentSuccess: React.FC = () => {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="bg-white p-6 md:w-2/5 shadow-2xl rounded-3xl">
                <img src={CheckmarkSvg} alt="Checkmark" className="text-green-600 w-16 h-16 mx-auto my-6" />

                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Payment Done!
                    </h3>
                    <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                    <p> Have a great day! </p>
                    <div className="py-10 text-center">
                        <Link to="/">
                            <CustomButton>GO TO HOME</CustomButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
