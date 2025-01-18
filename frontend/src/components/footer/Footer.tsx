import { CURRENT_YEAR } from '../../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-center text-gray-300 py-8 px-4">
            <p className="text-sm">&copy; {CURRENT_YEAR} Resaurant app. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
