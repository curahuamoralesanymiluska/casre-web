import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent as AboutSectionComponent } from '../../components/about/about.component';
import { ServicesCardsComponent } from '../../components/services-cards/services-cards.component';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';
import { QuoteFormComponent } from '../../components/quote-form/quote-form.component';
import { WhatsAppFloatingComponent } from '../../components/whats-app-floating/whats-app-floating.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutSectionComponent,
    ServicesCardsComponent,
    WhyChooseUsComponent,
    QuoteFormComponent,
    WhatsAppFloatingComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent { }