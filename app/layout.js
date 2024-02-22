import './globals.css';
import Link from 'next/link';
export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				{' '}
				<script src="https://apis.google.com/js/api.js"></script>
			</head>

			<body>

                {children}
            </body>
		</html>
	);
}
