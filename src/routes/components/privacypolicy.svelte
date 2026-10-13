<script>
    import GradientText from './gradient_text.svelte';
    const currentDate = "20-12-2024";
    const contactEmail = "krishna@indq.in";
    const website = "www.indq.in";
  </script>
  
<div class="bg-white py-16 px-8">
    
    <div class="text-left mt-50 md:mt-25 mb-55 md:ml-45 ">
        <div class="text-6xl md:text-9xl space-y-5 font-gill">
            
            <div class="flex items-center font-semibold">
                <span>Privacy</span>
                <span class="text-blue-200">.</span>
            </div>
            
            <div class="flex items-center font-semibold">
                <span>Policy</span>
                <span class="bg-gradient-to-r from-[#B9DFF1] via-[#F3C9BD] to-[#F7E6A7] bg-clip-text text-transparent ml-2">.</span><br>
            </div>
        </div>
    </div>
  
      <!-- Content -->
    <div class="max-w-4xl mx-auto text-center">
        <div class="w-full lg:w-auto text-base lg:text-xl text-left pt-5 pb-10">
            <div class="space-y-6">
                <h2 class="text-4xl font-semibold mb-6">Privacy Policy for INDQ MedTech Product Design Studio</h2>
                <p class="font-medium text-gray-600">Last updated: {currentDate}</p>
                <p class="font-medium">
                    At INDQ MedTech Product Design Studio ("INDQ," "we," "our," or "us"), we are committed 
                    to protecting your privacy. This Privacy Policy explains how we collect, use, store, and 
                    protect your personal information when you interact with our digital platforms, products, or 
                    services, including AI-driven medical technologies.
                </p>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">1. Information We Collect</h3>
                    <p class="font-medium mb-3">We may collect the following types of information:</p>
                    <ul class="list-disc pl-6 space-y-2 font-medium">
                        <li>
                            <span class="font-semibold">Personal Information:</span> Name, email address, phone number, job title, company, etc., when
                            you contact us or sign up for updates.
                        </li>
                        <li>
                            <span class="font-semibold">Device and Usage Data:</span> IP address, browser type, pages visited, time spent, and similar
                            analytical data.
                        </li>
                        <li>
                            <span class="font-semibold">Product Interaction Data:</span> In the case of Proto or similar smart devices, anonymized usage
                            data, sensor data, or device interaction logs.
                        </li>
                        <li>
                            <span class="font-semibold">Health-Related Data (if applicable):</span> Any medical data used for algorithm training or device
                            feedback is de-identified and handled under applicable regulatory standards (e.g., HIPAA, GDPR).
                        </li>
                    </ul>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">2. How We Use Your Information</h3>
                    <p class="font-medium mb-3">We use your information to:</p>
                    <ul class="list-disc pl-6 space-y-2 font-medium">
                        <li>Improve and develop our MedTech products and services.</li>
                        <li>Respond to inquiries or provide customer support.</li>
                        <li>Conduct research and analysis (e.g., training AI algorithms).</li>
                        <li>Ensure product functionality and performance.</li>
                        <li>Comply with legal and regulatory obligations.</li>
                    </ul>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">3. Sharing Your Information</h3>
                    <p class="font-medium mb-3">We do not sell your personal data. We may share information with:</p>
                    <ul class="list-disc pl-6 space-y-2 font-medium">
                        <li>Technology and infrastructure partners who help us operate and support our devices or platforms.</li>
                        <li>Regulatory authorities where required by law for clinical trials or compliance audits.</li>
                        <li>Research collaborators, only using anonymized or aggregated data.</li>
                    </ul>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">4. Data Security</h3>
                    <p class="font-medium">
                        We implement robust security measures to protect your data, including encryption, secure
                        storage systems, access control, and regular audits. Our systems comply with medical data
                        standards and follow best practices in MedTech cybersecurity.
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">5. Data Retention</h3>
                    <p class="font-medium">
                        We retain your information only as long as necessary for the purposes stated in this policy or
                        as required by law.
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">6. Your Rights</h3>
                    <p class="font-medium mb-3">Depending on your location, you may have rights such as:</p>
                    <ul class="list-disc pl-6 space-y-2 font-medium">
                        <li>Accessing the personal data we hold about you.</li>
                        <li>Requesting corrections or deletion.</li>
                        <li>Objecting to certain uses of your information.</li>
                    </ul>
                    <p class="font-medium mt-3">
                        To exercise your rights, please contact us at: <a href="mailto:{contactEmail}" class="text-blue-600 hover:underline">{contactEmail}</a>
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">7. Children's Privacy</h3>
                    <p class="font-medium">
                        Our services are not directed to individuals under the age of 18. We do not knowingly collect
                        personal data from children.
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">8. International Data Transfers</h3>
                    <p class="font-medium">
                        If you are located outside of India, your data may be transferred to and processed in India,
                        where our servers and offices are located. We ensure appropriate safeguards for international
                        data transfers.
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">9. Updates to This Policy</h3>
                    <p class="font-medium">
                        We may update this Privacy Policy occasionally. When we do, we'll post the revised policy
                        here with the updated date.
                    </p>
                </div>
          
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">10. Contact Us</h3>
                    <p class="font-medium">
                        If you have any questions about this policy or our data practices, please contact us at:
                    </p>
                    <p class="font-medium mt-2">
                        <a href="mailto:{contactEmail}" class="text-blue-600 hover:underline">{contactEmail}</a>
                    </p>
                    <p class="font-medium mt-4">
                        INDQ MedTech Product Design Studio<br>
                        Visakhapatnam | Hyderabad | Bangalore | <br>
                        <a href="https://{website}" class="text-blue-600 hover:underline">{website}</a>
                    </p>
                </div>
          
                <div class="mt-12 pt-8 border-t border-gray-200">
                    <h2 class="text-2xl font-semibold mb-6">Categories of Personal Information</h2>
                    <p class="font-medium mb-6">The website might collect the following information:</p>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="py-3 px-4 text-left text-sm font-semibold">Category</th>
                                    <!-- <th class="py-3 px-4 text-left text-sm font-semibold">Collected</th> -->
                                    <th class="py-3 px-4 text-left text-sm font-semibold">Source</th>
                                    <th class="py-3 px-4 text-left text-sm font-semibold">Purpose</th>
                                    <th class="py-3 px-4 text-left text-sm font-semibold">Shared With</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Name</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly, application forms, event registrations</td>
                                    <td class="py-3 px-4 text-sm">To respond to inquiries, provide updates, complete transactions, process job applications</td>
                                    <td class="py-3 px-4 text-sm">CRM services, communication tools</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Alias</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly, online forms</td>
                                    <td class="py-3 px-4 text-sm">For user personalization and system recognition</td>
                                    <td class="py-3 px-4 text-sm">Analytics providers</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Postal Address</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly</td>
                                    <td class="py-3 px-4 text-sm">To ship physical products or event material, tailor services to regions</td>
                                    <td class="py-3 px-4 text-sm">Delivery partners</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Email Address</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly, partner events</td>
                                    <td class="py-3 px-4 text-sm">To send updates, respond to queries, deliver newsletters, conduct feedback surveys</td>
                                    <td class="py-3 px-4 text-sm">Communication services, CRM tools</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Telephone Number</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly</td>
                                    <td class="py-3 px-4 text-sm">For communication related to support, product feedback, job applications</td>
                                    <td class="py-3 px-4 text-sm">Communication providers</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Unique Personal Identifier</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From website and digital platform interactions</td>
                                    <td class="py-3 px-4 text-sm">To analyze traffic, secure accounts, improve digital experiences</td>
                                    <td class="py-3 px-4 text-sm">Web analytics platforms, cloud providers</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Physical Characteristics</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">Directly from users (photos/videos in applications or events)</td>
                                    <td class="py-3 px-4 text-sm">For challenge submissions, event presentations, and documentation</td>
                                    <td class="py-3 px-4 text-sm">Internal evaluation tools</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Professional Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">Directly from applicants</td>
                                    <td class="py-3 px-4 text-sm">To assess fit for roles or collaboration opportunities</td>
                                    <td class="py-3 px-4 text-sm">Recruitment platforms, internal HR systems</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Education Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From users directly</td>
                                    <td class="py-3 px-4 text-sm">To assess qualifications for specific programs or job roles</td>
                                    <td class="py-3 px-4 text-sm">Recruitment platforms</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Medical Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From healthcare professionals or device usage data (fully anonymized)</td>
                                    <td class="py-3 px-4 text-sm">For clinical research and AI training for device development</td>
                                    <td class="py-3 px-4 text-sm">Research collaborators (anonymized)</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Financial Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From payment service providers (e.g., Stripe)</td>
                                    <td class="py-3 px-4 text-sm">To process payments for services, consultations, or purchases</td>
                                    <td class="py-3 px-4 text-sm">Payment gateways</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Commercial Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From e-commerce platforms</td>
                                    <td class="py-3 px-4 text-sm">To analyze trends and improve offerings</td>
                                    <td class="py-3 px-4 text-sm">Analytics providers</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Geolocation Data</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From user input or IP-based estimation</td>
                                    <td class="py-3 px-4 text-sm">To tailor services or experiences based on location</td>
                                    <td class="py-3 px-4 text-sm">Analytics platforms</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Internet Activity</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From interactions with websites and apps</td>
                                    <td class="py-3 px-4 text-sm">To analyze usage and enhance services</td>
                                    <td class="py-3 px-4 text-sm">Analytics and tracking providers</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Audio Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From online meetings, user-submitted media</td>
                                    <td class="py-3 px-4 text-sm">To evaluate submissions, support education, or document presentations</td>
                                    <td class="py-3 px-4 text-sm">Internal storage, educational archives</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-sm font-medium">Visual Information</td>
                                    <!-- <td class="py-3 px-4 text-sm">✅</td> -->
                                    <td class="py-3 px-4 text-sm">From photos, videos, video calls</td>
                                    <td class="py-3 px-4 text-sm">For product testing feedback, user engagement activities</td>
                                    <td class="py-3 px-4 text-sm">Design teams, internal archives</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>