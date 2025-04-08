
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDestinations, registerUser } from '@/services/api';
import { toast } from 'sonner';

// This URL should match your EasyPHP setup
// Default EasyPHP URL is usually http://127.0.0.1/
const API_URL = 'http://127.0.0.1/travelers_planner/api';

const TestConnection = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<string>('');
  const [regLoading, setRegLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      const response = await getDestinations();
      console.log('API Response:', response);
      
      if (response.success) {
        setTestResult(`Connection successful! Found ${response.data.length} destinations.`);
        toast.success('Backend connection successful!');
      } else {
        setTestResult(`Connection failed: ${response.message}`);
        toast.error('Connection failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setRegLoading(true);
    setRegistrationResult('Testing registration...');
    
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const response = await registerUser('Test User', testEmail, 'password123');
      console.log('Registration Response:', response);
      
      if (response.success) {
        setRegistrationResult(`Registration successful! User ID: ${response.user.id}`);
        toast.success('Registration successful!');
      } else {
        setRegistrationResult(`Registration failed: ${response.message}`);
        toast.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration test error:', error);
      setRegistrationResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Registration error');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test (Travelers Planner)</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test API Connection</h2>
            <p className="mb-4">This will test if your frontend can connect to the PHP backend by fetching destinations.</p>
            
            <Button 
              onClick={testBackendConnection} 
              disabled={loading}
              className="bg-travel-blue-bright hover:bg-travel-blue-bright/90 mb-4"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {testResult && (
              <div className={`p-4 rounded-md ${testResult.includes('successful') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {testResult}
              </div>
            )}
          </div>
          
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test User Registration</h2>
            <p className="mb-4">This will test if user registration is working properly by creating a test user.</p>
            
            <Button 
              onClick={testRegistration} 
              disabled={regLoading}
              className="bg-travel-orange hover:bg-travel-orange/90 mb-4"
            >
              {regLoading ? 'Testing...' : 'Test Registration'}
            </Button>
            
            {registrationResult && (
              <div className={`p-4 rounded-md ${registrationResult.includes('successful') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {registrationResult}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Travelers Planner Database Setup</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make sure EasyPHP is running (check that both HTTP and MySQL servers are active)</li>
            <li>Create a database called <code>travelers_planner</code> in your MySQL admin panel</li>
            <li>Import the SQL file <code>db/travelers_planner.sql</code> to set up your database</li>
            <li>Verify the API_URL is correct in services/api.ts: <code>{API_URL}</code></li>
            <li>Current API URL: <code>{API_URL}</code></li>
            <li>Check the browser console for any error messages (F12)</li>
            <li>Verify that your PHP files are in <code>data/localweb/travelers_planner/api</code> folder</li>
            <li>Check that the database credentials in api/config/database.php match your setup</li>
          </ul>
        </div>

        <div className="mt-6 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Account Credentials</h2>
          <p className="mb-2">Use these credentials for testing after successful registration:</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <p><strong>Email:</strong> test123@example.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestConnection;
