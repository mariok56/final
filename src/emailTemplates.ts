// functions/src/emailTemplates.ts

interface Appointment {
    id: string;
    services: { name: string; price: number; duration: number }[];
    stylistId: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    totalDuration: number;
    notes?: string;
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
  }
  
  interface Stylist {
    name: string;
    specialty: string;
  }
  
  interface EmailTemplateProps {
    appointment: Appointment;
    user: User;
    stylist: Stylist;
  }
  
  export const generateEmailHTML = ({ appointment, user, stylist }: EmailTemplateProps) => {
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation - Choppers Salon</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
          <tr>
            <td style="padding: 20px 0;">
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #000000; padding: 20px; text-align: center;">
                    <img src="https://yoursalondomain.com/logo.svg" alt="Choppers Salon" style="max-width: 150px; height: auto;">
                  </td>
                </tr>
                
                <!-- Confirmation Badge -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <div style="display: inline-block; background-color: #4CAF50; color: white; width: 60px; height: 60px; border-radius: 50%; line-height: 60px; font-size: 24px; margin-bottom: 20px;">
                      ✓
                    </div>
                    <h1 style="color: #333333; font-size: 24px; margin: 0; margin-bottom: 15px;">Appointment Confirmed!</h1>
                    <p style="color: #666666; font-size: 16px; margin: 0;">Thank you for booking with Choppers Salon, ${user.name}.</p>
                  </td>
                </tr>
                
                <!-- Appointment Details -->
                <tr>
                  <td style="padding: 0 30px 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h2 style="color: #333333; font-size: 18px; margin: 0 0 20px;">Appointment Details</h2>
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Appointment ID:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${appointment.id}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Services:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${appointment.services.map(s => s.name).join(', ')}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Stylist:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${stylist.name}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Date:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${new Date(appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Time:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${appointment.startTime} - ${appointment.endTime}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                                <strong style="color: #666666;">Duration:</strong>
                              </td>
                              <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right;">
                                ${appointment.totalDuration} minutes
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0;">
                                <strong style="color: #fbb034;">Total:</strong>
                              </td>
                              <td style="padding: 10px 0; text-align: right;">
                                <strong style="color: #fbb034;">$${appointment.totalPrice}</strong>
                              </td>
                            </tr>
                          </table>
                          
                          ${appointment.notes ? `
                            <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #fbb034;">
                              <strong style="color: #666666;">Notes:</strong>
                              <p style="margin: 5px 0 0; color: #333333;">${appointment.notes}</p>
                            </div>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Call to Action -->
                <tr>
                  <td style="padding: 0 30px 30px; text-align: center;">
                    <a href="https://yoursalondomain.com/booking" style="display: inline-block; background-color: #fbb034; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">Manage Appointment</a>
                  </td>
                </tr>
                
                <!-- Location and Contact Info -->
                <tr>
                  <td style="padding: 0 30px 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="width: 50%; padding-right: 15px;">
                          <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px;">Our Location</h3>
                          <p style="color: #666666; font-size: 14px; margin: 0;">
                            123 Salon Street<br>
                            Beauty District<br>
                            City, 10001
                          </p>
                        </td>
                        <td style="width: 50%; padding-left: 15px;">
                          <h3 style="color: #333333; font-size: 16px; margin: 0 0 10px;">Contact Us</h3>
                          <p style="color: #666666; font-size: 14px; margin: 0;">
                            Phone: (123) 456-7890<br>
                            Email: info@yoursalondomain.com
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                    <p style="color: #666666; font-size: 12px; margin: 0;">
                      Need to cancel or reschedule? Please call us at (123) 456-7890 or manage your appointment online.
                    </p>
                    <p style="color: #999999; font-size: 12px; margin: 10px 0 0;">
                      © ${new Date().getFullYear()} Choppers Salon. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };