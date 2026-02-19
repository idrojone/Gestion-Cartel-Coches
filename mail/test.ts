
import { sendMail } from './serverMail';

async function testMail() {
    console.log('Sending test email...');
    try {
        const result = await sendMail({
            to: 'test@example.com',
            subject: 'Test Email from Script',
            text: 'This is a test email sent from the test script.'
        });
        console.log('Test email sent successfully:', result);
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testMail();
