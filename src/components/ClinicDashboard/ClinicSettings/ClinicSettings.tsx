import { useState } from "react";
import License from "@/components/ClinicDashboard/ClinicSettings/license-documents";
import Payout from "@/components/ClinicDashboard/ClinicSettings/payout-methods";
import AvailabilitySettings from "@/components/ClinicDashboard/ClinicSettings/AvailabilitySettings";
import NotificationPreferences from "@/components/ClinicDashboard/ClinicSettings/NotificationPreferences";

import ClinicProfileSettings from "@/components/ClinicDashboard/ClinicSettings/ClinicProfileSettings";
import { Link } from "react-router-dom";


interface ClinicSettingsProps {
 activeTab: "ClinicProfile" | "License" | "Availability" | "Payout" | "Notification" | "Help";
}

const ClinicSettings = ({ activeTab }: ClinicSettingsProps) => {
// STATE variables 
const [clinicName, setClinicName] = useState("Wardier Medical Clinic");
const [email, setEmail] = useState("wardier.clinic@gmail.com");
const [phone, setPhone] = useState("(+995) 126 - 245 -78936"); 
const [address, setAddress] = useState("12 Rustaveli Street, Vake District, Tbilisi, Georgia");
const [servicesOffered, setServicesOffered] = useState("General Medicine, Cardiology, Pediatrics, Dermatology, Orthopedics, ENT, Gynecology");
const [description, setDescription] = useState("Premier healthcare facility providing comprehensive medical services with a team of experienced professionals.");


const renderClinicProfile = () => (
    <ClinicProfileSettings 
        clinicName={clinicName}
        setClinicName={setClinicName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        servicesOffered={servicesOffered}
        setServicesOffered={setServicesOffered}
        description={description}
        setDescription={setDescription}
    />
);


const renderHelp = () => (
 <div className="bg-white rounded-xl mt-5 p-4 sm:p-6 lg:p-8">
 <h2 className="text-xl font-semibold text-gray-800 mb-4">Help & Support</h2>
 <p className="text-gray-600 mb-6">Get assistance and find answers to common questions</p>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
 <div className="text-3xl mb-3">📚</div>
 <h3 className="font-semibold text-gray-800 mb-2">Documentation</h3>
 <p className="text-sm text-gray-600">Browse our comprehensive guides</p>
 </div>
 
<Link to="/clinic-dashboard/message" state={{ showAdmin: true }}>
<div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
 <div className="text-3xl mb-3">💬</div>
 <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
 <p className="text-sm text-gray-600">Chat with our support team</p>
 </div>
</Link>



 <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
 <div className="text-3xl mb-3">📧</div>
 <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
 <p className="text-sm text-gray-600">support@clinic.com</p>
 </div>
 
 <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
 <div className="text-3xl mb-3">❓</div>
 <h3 className="font-semibold text-gray-800 mb-2">FAQ</h3>
 <p className="text-sm text-gray-600">Find quick answers</p>
 </div>
 </div>
 </div>
 );

const renderAvailability = () => {
 return <AvailabilitySettings />;
};

switch (activeTab) { case "ClinicProfile":
 return renderClinicProfile();
 case "License":
 return <License />;
 case "Availability":
 return renderAvailability(); case "Payout":
 return <Payout />;
 case "Notification":
 return <NotificationPreferences />; 
 case "Help":
 return renderHelp();
 default:
 return renderClinicProfile();
}

};

export default ClinicSettings;