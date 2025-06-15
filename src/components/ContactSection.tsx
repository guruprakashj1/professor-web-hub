
import ContactForm from './ContactForm';

const ContactSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Get In Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          I'm always interested in hearing about new opportunities, collaborations, 
          or just connecting with fellow academics and researchers.
        </p>
      </div>
      
      <ContactForm />
    </div>
  );
};

export default ContactSection;
