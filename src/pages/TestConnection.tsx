import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDestinations, registerUser } from '@/services/api';

const API_URL = 'http://localhost/travel_planner/api';

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
      } else {
        setTestResult(`Connection failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      } else {
        setRegistrationResult(`Registration failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Registration test error:', error);
      setRegistrationResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
        
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
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make sure XAMPP is running (Apache and MySQL services)</li>
            <li>Check if your database is properly set up at <code>http://localhost/phpmyadmin</code></li>
            <li>Make sure API_URL is correct in services/api.ts: <code>{API_URL}</code></li>
            <li>Check the browser console for any error messages</li>
            <li>Verify that your PHP files are in the correct location in XAMPP htdocs folder</li>
            <li>Check PHP error logs in XAMPP if registration is failing</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestConnection;
