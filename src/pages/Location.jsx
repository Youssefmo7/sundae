import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Location() {


  return (
    <>
      <Header />
      <div className="location-banner"><p>Our Location</p> </div>
      <p className="getInTouch">Get in <span>Touch</span> With Us</p>
      <div className="location-form-container">
        <form>
          <div className="location-fields-container">
            <div className="input-container">
              {/* <label for="firstName">First Name <span>*</span></label> */}
              <input type="text" name="firstName" placeholder="First Name" />
            </div>
            <div className="input-container">
              {/* <label for="lastName">
                Last Name <span>*</span>
              </label> */}
              <input type="text" name="lastName" placeholder="Last Name" />
            </div>
            <div className="input-container">
              {/* <label for="phoneNumber">
                Phone Number <span>*</span>
              </label> */}
              <input type="tel" name="phoneNumber" placeholder="Phone Number" />
            </div>
            <div className="input-container">
              {/* <label for="email">
                Email Address <span>*</span>
              </label> */}
              <input type="email" name="email" placeholder="Email Address" />
            </div>
            <div className="textarea-container">
              {/* <label for="message">Write Your Message</label> */}
              <textarea name="message" id="" placeholder='Write Your Message'></textarea>
            </div>
          </div>
          <button type="submit" className="btn-sky">Submit</button>
          {/* <div className="our-location">
            <p>Detailed Address</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13237.563528788708!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840d9f20e3f9b%3A0x6a0c82335cf1aaba!2sCairo!5e0!3m2!1sen!2seg!4v1696000000000"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div> */}
        </form>
      </div>
      <Footer />
    </>
  );
}
