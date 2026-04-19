import type { InboxItem } from '@/lib/types'

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000)
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000)

export const inboxItems: InboxItem[] = [
  {
    id: 'inbox-1',
    colleagueId: 'sarah-chen',
    subject: 'Re: Q1 Strategy Review - Goldman Sachs',
    from: 'john.thompson@gs.com',
    fromName: 'John Thompson',
    preview: 'Thank you for your email. We would like to propose the following dates for our Q1 strategy review...',
    timestamp: minutesAgo(15),
    unread: true,
    thread: [
      {
        id: 'msg-1a',
        from: 'sarah.chen@company.com',
        fromName: 'Sarah Chen',
        to: 'john.thompson@gs.com',
        timestamp: hoursAgo(26),
        body: `John,\n\nFollowing our call last week, I wanted to touch base on scheduling the Q1 strategy review. We have availability in the last two weeks of April and would love to get this on the calendar before the board meeting.\n\nPlease let me know what works best for your team.\n\nBest,\nSarah`,
      },
      {
        id: 'msg-1b',
        from: 'john.thompson@gs.com',
        fromName: 'John Thompson',
        to: 'sarah.chen@company.com',
        timestamp: minutesAgo(15),
        body: `Sarah,\n\nThank you for your email. We would like to propose the following dates for our Q1 strategy review meeting:\n\n- Wednesday April 23rd, 2:00–4:00 PM\n- Thursday April 24th, 10:00 AM–12:00 PM\n- Monday April 28th, 3:00–5:00 PM\n\nAll times are London time. Please let me know which works best and we will send a formal invite with the agenda.\n\nLooking forward to it.\n\nBest regards,\nJohn Thompson\nManaging Director, Goldman Sachs`,
      },
    ],
  },
  {
    id: 'inbox-2',
    colleagueId: 'sarah-chen',
    subject: 'Board Meeting Agenda - Final Review',
    from: 'board.secretary@company.com',
    fromName: 'Board Secretary',
    preview: 'Please find attached the final agenda for the upcoming board meeting. Kindly confirm your presentation slot...',
    timestamp: minutesAgo(45),
    unread: true,
    thread: [
      {
        id: 'msg-2a',
        from: 'board.secretary@company.com',
        fromName: 'Board Secretary',
        to: 'sarah.chen@company.com',
        timestamp: minutesAgo(45),
        body: `Dear Sarah,\n\nPlease find attached the final agenda for the upcoming board meeting scheduled for April 22nd.\n\nYour presentation slot is confirmed for 10:15–10:45 AM. We kindly ask that you send your slides to this office no later than April 20th for pre-distribution to board members.\n\nPlease confirm receipt of this email and your acceptance of the slot.\n\nKind regards,\nBoard Secretariat`,
      },
    ],
  },
  {
    id: 'inbox-3',
    colleagueId: 'sarah-chen',
    subject: 'Travel Itinerary Update - London Trip',
    from: 'travel@corporate-travel.com',
    fromName: 'Corporate Travel',
    preview: 'Your flight BA289 from LHR to JFK has been updated. New departure time: 08:40 AM...',
    timestamp: hoursAgo(2),
    unread: false,
    thread: [
      {
        id: 'msg-3a',
        from: 'travel@corporate-travel.com',
        fromName: 'Corporate Travel',
        to: 'sarah.chen@company.com',
        timestamp: hoursAgo(2),
        body: `Dear Traveller,\n\nThis is an update to your upcoming itinerary.\n\nFlight: BA289\nRoute: London Heathrow (LHR) to New York JFK\nDate: Thursday, April 17th\nNew Departure Time: 08:40 AM (revised from 09:15 AM)\nArrival: 11:55 AM EST\nSeat: 2A (Business Class)\n\nPlease note that due to a North Atlantic weather system, there is a possibility of further delays or route changes. We recommend arriving at the airport by 6:30 AM.\n\nYour hotel confirmation at The Peninsula New York remains unchanged: check-in April 17th, check-out April 19th.\n\nCorporate Travel Desk`,
      },
    ],
  },
  {
    id: 'inbox-4',
    colleagueId: 'james-whitfield',
    subject: 'McKinsey Proposal - Final Draft',
    from: 'partner@mckinsey.com',
    fromName: 'Alexandra Reid',
    preview: 'As discussed, please find the final version of our proposal. We look forward to your feedback...',
    timestamp: hoursAgo(3),
    unread: true,
    thread: [
      {
        id: 'msg-4a',
        from: 'james.whitfield@company.com',
        fromName: 'James Whitfield',
        to: 'partner@mckinsey.com',
        timestamp: hoursAgo(48),
        body: `Alexandra,\n\nThank you for the draft proposal. I have reviewed it with my team and we have a few questions around the implementation timeline in section 3. Could you clarify the assumptions around resource allocation?\n\nAlso, is there flexibility on the start date?\n\nJames`,
      },
      {
        id: 'msg-4b',
        from: 'partner@mckinsey.com',
        fromName: 'Alexandra Reid',
        to: 'james.whitfield@company.com',
        timestamp: hoursAgo(3),
        body: `James,\n\nAs discussed on our call, please find the final version of our proposal incorporating your feedback.\n\nKey changes from the previous draft:\n- Implementation timeline extended by 3 weeks to account for resource onboarding\n- Start date moved to May 12th\n- Section 3 revised with clearer resource allocation assumptions\n\nWe believe this proposal represents significant value for the organisation and look forward to your feedback.\n\nPlease do not hesitate to reach out with any further questions.\n\nBest,\nAlexandra Reid\nPartner, McKinsey & Company`,
      },
    ],
  },
  {
    id: 'inbox-5',
    colleagueId: 'james-whitfield',
    subject: 'Team Sync - Updated Agenda',
    from: 'team-lead@company.com',
    fromName: 'Marcus Chen',
    preview: 'I have updated the agenda for our weekly sync. Please review before the meeting tomorrow...',
    timestamp: hoursAgo(4),
    unread: false,
    thread: [
      {
        id: 'msg-5a',
        from: 'team-lead@company.com',
        fromName: 'Marcus Chen',
        to: 'james.whitfield@company.com',
        timestamp: hoursAgo(4),
        body: `Hi James,\n\nI have updated the agenda for tomorrow's weekly sync (Thursday 10:00 AM, Boardroom 2).\n\nUpdated agenda:\n1. Q1 results review (15 min)\n2. McKinsey engagement kick-off planning (20 min)\n3. Headcount approvals - 3 pending sign-offs (10 min)\n4. AOB\n\nI have added the McKinsey discussion following your note this morning. Let me know if you need me to invite anyone else.\n\nMarcus`,
      },
    ],
  },
  {
    id: 'inbox-6',
    colleagueId: 'adelina-atara',
    subject: 'AWS Contract Renewal Notice',
    from: 'contracts@aws.com',
    fromName: 'AWS Enterprise',
    preview: 'Your current AWS Enterprise contract is set to expire on May 15th. Please contact your account manager...',
    timestamp: hoursAgo(6),
    unread: true,
    thread: [
      {
        id: 'msg-6a',
        from: 'contracts@aws.com',
        fromName: 'AWS Enterprise',
        to: 'adelina.atara@company.com',
        timestamp: hoursAgo(6),
        body: `Dear Adelina,\n\nThis is a formal notice that your current AWS Enterprise Agreement (Account ID: 123456789) is set to expire on May 15th, 2026.\n\nTo ensure continuity of service, we recommend initiating renewal discussions at least 30 days prior to expiry. Your dedicated account manager, Tom Briggs (tom.briggs@aws.com), is available to discuss renewal terms.\n\nCurrent contract value: $2.4M annually\nExpiry date: May 15th, 2026\nRenewal window: Now – May 1st, 2026\n\nPlease contact Tom at your earliest convenience.\n\nAWS Enterprise Team`,
      },
    ],
  },
  {
    id: 'inbox-7',
    colleagueId: 'adelina-atara',
    subject: 'Singapore Visa Application Status',
    from: 'visas@embassy.sg',
    fromName: 'Singapore Embassy',
    preview: 'Your visa application has been received. Please allow 5-7 business days for processing...',
    timestamp: hoursAgo(1),
    unread: true,
    thread: [
      {
        id: 'msg-7a',
        from: 'visas@embassy.sg',
        fromName: 'Singapore Embassy',
        to: 'adelina.atara@company.com',
        timestamp: hoursAgo(1),
        body: `Dear Applicant,\n\nWe acknowledge receipt of your visa application (Reference: SG-2026-04-88231).\n\nApplication details:\nApplicant: Adelina Atara\nVisa type: Multiple Entry Business Visa\nIntended travel dates: May 3–7, 2026\n\nYour application is now under review. Please allow 5–7 business days for processing. You will receive a further email once a decision has been made.\n\nIf you have not heard back within 10 business days, please contact us at visas@embassy.sg quoting your reference number.\n\nSingapore Immigration Authority`,
      },
    ],
  },
  {
    id: 'inbox-8',
    colleagueId: 'frederick-blunst',
    subject: 'Bloomberg Interview Request',
    from: 'journalist@bloomberg.com',
    fromName: 'Claire Watts',
    preview: 'We would like to invite Frederick Blunst for a 30-minute interview on current industry trends...',
    timestamp: hoursAgo(5),
    unread: false,
    thread: [
      {
        id: 'msg-8a',
        from: 'journalist@bloomberg.com',
        fromName: 'Claire Watts',
        to: 'frederick.blunst@company.com',
        timestamp: hoursAgo(5),
        body: `Dear Frederick,\n\nI am a senior reporter at Bloomberg covering the technology and private equity sectors. I am writing a feature piece on the current state of enterprise AI adoption and the role of senior operators.\n\nWe would love to include your perspective. The interview would be approximately 30 minutes, conducted over video call at a time of your convenience, and would be on the record.\n\nWould you be open to speaking with us in the next two weeks? I am flexible on timing.\n\nBest regards,\nClaire Watts\nSenior Reporter, Bloomberg Technology`,
      },
    ],
  },
  {
    id: 'inbox-9',
    colleagueId: 'frederick-blunst',
    subject: 'Q1 Report - Awaiting Approval',
    from: 'finance@company.com',
    fromName: 'Finance Team',
    preview: 'The Q1 report is ready for final approval. Please review and sign off at your earliest convenience...',
    timestamp: hoursAgo(2),
    unread: true,
    thread: [
      {
        id: 'msg-9a',
        from: 'finance@company.com',
        fromName: 'Finance Team',
        to: 'frederick.blunst@company.com',
        timestamp: hoursAgo(2),
        body: `Frederick,\n\nThe Q1 2026 financial report is now ready for your final sign-off.\n\nKey highlights:\n- Revenue: $48.2M (+12% YoY)\n- EBITDA: $14.1M (29% margin)\n- Net cash position: $22.8M\n- Headcount: 312 (up from 287 at end of Q4)\n\nThe report will be distributed to the board on April 20th. We need your digital signature by April 18th at 5:00 PM.\n\nThe document is available on the Finance portal. Please let us know if you require any amendments.\n\nFinance Team`,
      },
    ],
  },
  {
    id: 'inbox-10',
    colleagueId: 'personal',
    subject: 'Car Service Appointment Confirmation',
    from: 'service@dealership.com',
    fromName: 'Aston Martin Service',
    preview: 'This is a reminder of your upcoming car service appointment on April 17th at 9:00 AM...',
    timestamp: hoursAgo(8),
    unread: false,
    thread: [
      {
        id: 'msg-10a',
        from: 'service@dealership.com',
        fromName: 'Aston Martin Service',
        to: 'ryan.west@company.com',
        timestamp: hoursAgo(8),
        body: `Dear Mr West,\n\nThis is a confirmation of your upcoming service appointment.\n\nVehicle: Aston Martin DB12 (2024)\nRegistration: RW24 EAC\nService type: Annual service + brake fluid replacement\nDate: Thursday, April 17th, 2026\nTime: 9:00 AM\nLocation: Aston Martin London, 33 Sloane St, Chelsea\n\nExpected duration: 3–4 hours. A courtesy car is available on request — please let us know in advance if you require one.\n\nIf you need to reschedule, please call us on 020 7890 1234.\n\nAston Martin London Service Team`,
      },
    ],
  },
]

export function getInboxItemsByColleague(colleagueId: string): InboxItem[] {
  return inboxItems.filter((item) => item.colleagueId === colleagueId)
}

export function getInboxItemById(id: string): InboxItem | undefined {
  return inboxItems.find((item) => item.id === id)
}

export function getAllInboxItemsSorted(): InboxItem[] {
  return [...inboxItems].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
