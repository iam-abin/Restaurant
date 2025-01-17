import { useLocation } from 'react-router-dom';
import CustomButton from '../../components/Button/CustomButton';
import { useAppSelector } from '../../redux/hooks';
import { calculateRemainingTime } from '../../utils';

const ResetPasswordSended: React.FC = () => {
    const location = useLocation();
    const tokenExpiryTime = useAppSelector((store) => store.otpTokenReducer?.otpTokenExpiry);

    // Safely extract email or provide a fallback
    const email = location?.state?.email || 'your email';

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen text-center">
            <p className="text-lg">
                {!tokenExpiryTime && calculateRemainingTime(tokenExpiryTime!) === 0
                    ? 'reset link has expired'
                    : `A password reset link has been sent to your email ID ${email}. Please verify.`}
            </p>

            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="mt-4">
                <CustomButton>Open Gmail</CustomButton>
            </a>
        </div>
    );
};

export default ResetPasswordSended;
