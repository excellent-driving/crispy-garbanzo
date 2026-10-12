/**
 * Draft privacy policy and terms (2026-10-12), written from what the app actually
 * stores and which services it uses. Shown with a "concept" notice until the school
 * (or its lawyer) has approved them; set APPROVED to true then.
 * {school}, {address} and {email} are filled in from Admin › Settings.
 */
export const APPROVED = false;

type Section = { h: string; p: string[] };
type Doc = { title: string; intro: string; sections: Section[] };

export const privacy: Record<"nl" | "en", Doc> = {
  nl: {
    title: "Privacybeleid",
    intro: "{school} ({address}) gaat zorgvuldig om met je gegevens. Hier lees je welke gegevens we bewaren, waarvoor we ze gebruiken en wat je rechten zijn.",
    sections: [
      { h: "Welke gegevens we bewaren", p: [
        "Bij het aanmaken van een account: je naam, e-mailadres, telefoonnummer (als je dat invult), je taalvoorkeur en je wachtwoord. Je wachtwoord wordt versleuteld opgeslagen; wij kunnen het niet lezen.",
        "Bij het boeken van een les: het pakket, de instructeur, de datum en tijd, de betaalwijze en of de betaling is ontvangen.",
        "Bij het leren: welke lessen en quizzen je hebt afgerond en je scores.",
        "Via het contactformulier: je naam, e-mailadres en je bericht.",
      ] },
      { h: "Waarvoor we ze gebruiken", p: [
        "Om je account te beheren en je te laten inloggen, je lessen in te plannen, betalingen te verwerken en je voortgang bij te houden.",
        "Om je berichten over je boeking te sturen via WhatsApp of e-mail: een bevestiging, een herinnering, de bevestiging van je betaling of een annulering.",
        "Om je vragen te beantwoorden. We verkopen je gegevens niet en gebruiken ze niet voor reclame.",
      ] },
      { h: "Wie je gegevens kan zien", p: [
        "Medewerkers van de rijschool en je instructeur, voor zover dat nodig is voor je lessen.",
        "Diensten die de website gebruikt: Vercel (de website), Supabase (de database), Meta (WhatsApp-berichten) en Resend (e-mail). Deze diensten kunnen gegevens buiten Suriname verwerken, onder meer in de Verenigde Staten.",
      ] },
      { h: "Cookies", p: [
        "We gebruiken alleen cookies die nodig zijn: een om ingelogd te blijven en een om je gekozen taal te onthouden. We gebruiken geen advertentie- of volgcookies.",
      ] },
      { h: "Hoe lang we gegevens bewaren", p: [
        "Zolang je account bestaat. Daarna verwijderen we je gegevens, behalve wat we volgens de wet langer moeten bewaren, zoals de administratie van betalingen.",
      ] },
      { h: "Je rechten", p: [
        "Je mag je gegevens inzien, laten verbeteren of laten verwijderen. Je naam, telefoonnummer en taal kun je zelf aanpassen onder Profiel. Voor de rest mail je naar {email}.",
      ] },
      { h: "Wijzigingen", p: [
        "We kunnen dit privacybeleid aanpassen. Op deze pagina staat altijd de geldende versie.",
      ] },
    ],
  },
  en: {
    title: "Privacy policy",
    intro: "{school} ({address}) handles your data with care. This page explains what we store, what we use it for and what your rights are.",
    sections: [
      { h: "What we store", p: [
        "When you create an account: your name, email address, phone number (if you fill it in), your language and your password. Your password is stored encrypted; we can't read it.",
        "When you book a lesson: the package, the instructor, the date and time, the payment method and whether the payment was received.",
        "When you study: which lessons and quizzes you finished and your scores.",
        "Through the contact form: your name, email address and message.",
      ] },
      { h: "What we use it for", p: [
        "To manage your account and let you log in, schedule your lessons, process payments and keep track of your progress.",
        "To send you messages about your booking by WhatsApp or email: a confirmation, a reminder, a payment confirmation or a cancellation.",
        "To answer your questions. We don't sell your data or use it for advertising.",
      ] },
      { h: "Who can see your data", p: [
        "Staff of the driving school and your instructor, as far as needed for your lessons.",
        "Services the website uses: Vercel (the website), Supabase (the database), Meta (WhatsApp messages) and Resend (email). These services may process data outside Suriname, including in the United States.",
      ] },
      { h: "Cookies", p: [
        "We only use cookies that are needed: one to keep you logged in and one to remember your language. We don't use advertising or tracking cookies.",
      ] },
      { h: "How long we keep data", p: [
        "As long as your account exists. After that we delete your data, except what the law requires us to keep longer, such as payment records.",
      ] },
      { h: "Your rights", p: [
        "You may see, correct or delete your data. You can change your name, phone number and language yourself under Profile. For anything else, email {email}.",
      ] },
      { h: "Changes", p: [
        "We may change this privacy policy. This page always shows the current version.",
      ] },
    ],
  },
};

export const terms: Record<"nl" | "en", Doc> = {
  nl: {
    title: "Algemene voorwaarden",
    intro: "Deze voorwaarden gelden voor het gebruik van de website en de online lessen van {school}, {address}.",
    sections: [
      { h: "Je account", p: [
        "Vul je gegevens juist in en houd je wachtwoord geheim. Een account is voor één persoon.",
      ] },
      { h: "Pakketten en prijzen", p: [
        "De pakketten en prijzen staan op de website, in SRD. Wat bij een pakket hoort, staat bij dat pakket vermeld.",
      ] },
      { h: "Boeken en betalen", p: [
        "Een boeking staat op “Wacht op betaling” tot de rijschool je betaling heeft ontvangen en bevestigd. Je kunt contant betalen op de rijschool of, als die mogelijkheid wordt aangeboden, per bankoverschrijving.",
      ] },
      { h: "Annuleren", p: [
        "Je kunt een les tot 24 uur van tevoren zelf annuleren onder Mijn Boekingen. Wil je later annuleren, neem dan contact op met de rijschool.",
      ] },
      { h: "Online lessen", p: [
        "De online lessen zijn voor je eigen gebruik. Je mag ze niet delen of kopiëren. Bij misbruik kan de rijschool je toegang beperken.",
        "De lesstof is met zorg samengesteld als voorbereiding op het examen. De wet en het officiële examen zijn altijd leidend.",
      ] },
      { h: "Aansprakelijkheid", p: [
        "De rijschool is niet aansprakelijk voor schade door het gebruik van de website, behalve bij opzet of grove nalatigheid.",
      ] },
      { h: "Contact", p: [
        "Vragen over deze voorwaarden? Mail naar {email}.",
      ] },
    ],
  },
  en: {
    title: "Terms and conditions",
    intro: "These terms apply to the use of the website and online lessons of {school}, {address}.",
    sections: [
      { h: "Your account", p: [
        "Fill in your details correctly and keep your password secret. An account is for one person.",
      ] },
      { h: "Packages and prices", p: [
        "Packages and prices are shown on the website, in SRD. What a package includes is listed with that package.",
      ] },
      { h: "Booking and paying", p: [
        "A booking shows “Pending Payment” until the driving school has received and confirmed your payment. You can pay cash at the driving school or, when it is offered, by bank transfer.",
      ] },
      { h: "Cancelling", p: [
        "You can cancel a lesson yourself under My Bookings up to 24 hours in advance. To cancel later, contact the driving school.",
      ] },
      { h: "Online lessons", p: [
        "The online lessons are for your own use. You may not share or copy them. In case of misuse the driving school may limit your access.",
        "The course material was put together with care as preparation for the exam. The law and the official exam always take precedence.",
      ] },
      { h: "Liability", p: [
        "The driving school is not liable for damage caused by using the website, except in case of intent or gross negligence.",
      ] },
      { h: "Contact", p: [
        "Questions about these terms? Email {email}.",
      ] },
    ],
  },
};
