'use server';

/**
 * @fileOverview Uses generative AI to compose custom SMS messages when a user arrives or leaves a geofenced location.
 *
 * - customAlertSMS - A function that handles composing the SMS message.
 * - CustomAlertSMSInput - The input type for the customAlertSMS function.
 * - CustomAlertSMSOutput - The return type for the customAlertSMS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomAlertSMSInputSchema = z.object({
  locationName: z.string().describe('The name of the location the user is arriving at or leaving.'),
  eventType: z.enum(['arrival', 'departure']).describe('Whether the user is arriving or departing.'),
  time: z.string().describe('The current time.'),
  userName: z.string().describe('The name of the user.'),
  relationship: z.string().describe('The user’s relationship to the contact, e.g., mother, friend, etc.'),
});
export type CustomAlertSMSInput = z.infer<typeof CustomAlertSMSInputSchema>;

const CustomAlertSMSOutputSchema = z.object({
  message: z.string().describe('The generated SMS message.'),
});
export type CustomAlertSMSOutput = z.infer<typeof CustomAlertSMSOutputSchema>;

export async function customAlertSMS(input: CustomAlertSMSInput): Promise<CustomAlertSMSOutput> {
  return customAlertSMSFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customAlertSMSPrompt',
  input: {schema: CustomAlertSMSInputSchema},
  output: {schema: CustomAlertSMSOutputSchema},
  prompt: `You are an expert SMS message composer for a safety application.

You will be provided with the name of a location, whether the user is arriving or departing, the time, the user's name, and the user's relationship to the contact.

Compose a short, informative, and personalized SMS message to be sent to the user's contact.

Location Name: {{{locationName}}}
Event Type: {{{eventType}}}
Time: {{{time}}}
User Name: {{{userName}}}
Relationship: {{{relationship}}}

SMS Message: `,
});

const customAlertSMSFlow = ai.defineFlow(
  {
    name: 'customAlertSMSFlow',
    inputSchema: CustomAlertSMSInputSchema,
    outputSchema: CustomAlertSMSOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
