import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function About() {
  return (
    <>
      <Header />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* About Header */}
            <div className="text-center mb-16">
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-6 elvish-shadow">
                About the Hobbits
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover the peaceful folk of the Shire and their timeless wisdom
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border hover-glow mb-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="font-cinzel text-3xl font-bold text-primary mb-6">The Shire: A Land of Simple Pleasures</h3>
                  <div className="prose prose-lg text-foreground">
                    <p className="mb-4">
                      In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.
                    </p>
                    <p className="mb-4">
                      The Shire is a place where time moves slowly, where the greatest concerns are when to have second breakfast and whether the garden needs tending. It is a land of rolling green hills, babbling brooks, and cozy homes built into the earth itself.
                    </p>
                    <p>
                      Here, wisdom is found not in ancient tomes or mystical artifacts, but in the simple truths of daily life: that friends are treasures beyond gold, that a warm meal shared is worth more than a feast eaten alone, and that the smallest acts of kindness can echo through generations.
                    </p>
                  </div>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Hobbit hole with round door" 
                    className="w-full rounded-2xl shadow-xl parchment-border"
                    data-testid="img-hobbit-hole"
                  />
                </div>
              </div>
            </div>

            {/* Hobbit Qualities */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 parchment-border hover-glow text-center" data-testid="card-nature-love">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl">🌱</span>
                </div>
                <h4 className="font-cinzel text-xl font-semibold text-primary mb-4">Love of Nature</h4>
                <p className="text-muted-foreground">
                  Hobbits have a deep connection to the earth, finding joy in gardening, farming, and the simple beauty of the natural world.
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 parchment-border hover-glow text-center" data-testid="card-food-appreciation">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl">🍽️</span>
                </div>
                <h4 className="font-cinzel text-xl font-semibold text-primary mb-4">Appreciation of Food</h4>
                <p className="text-muted-foreground">
                  From first breakfast to supper, hobbits understand that food brings people together and nourishes both body and soul.
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 parchment-border hover-glow text-center" data-testid="card-home-value">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl">🏠</span>
                </div>
                <h4 className="font-cinzel text-xl font-semibold text-primary mb-4">Value of Home</h4>
                <p className="text-muted-foreground">
                  There is no place more sacred to a hobbit than home, where comfort, safety, and love create the foundation of a good life.
                </p>
              </div>
            </div>

            {/* Hobbit Wisdom */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border hover-glow">
              <h3 className="font-cinzel text-3xl font-bold text-primary text-center mb-8">Wisdom from the Shire</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <blockquote className="border-l-4 border-accent pl-6 italic text-lg" data-testid="quote-samwise-1">
                    <p className="text-muted-foreground mb-2">"It's the job that's never started as takes longest to finish."</p>
                    <cite className="text-sm text-primary font-semibold">- Samwise Gamgee</cite>
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-accent pl-6 italic text-lg" data-testid="quote-bilbo-1">
                    <p className="text-muted-foreground mb-2">"I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve."</p>
                    <cite className="text-sm text-primary font-semibold">- Bilbo Baggins</cite>
                  </blockquote>
                </div>
                
                <div className="space-y-6">
                  <blockquote className="border-l-4 border-accent pl-6 italic text-lg" data-testid="quote-bilbo-2">
                    <p className="text-muted-foreground mb-2">"We are plain quiet folk and have no use for adventures. Nasty disturbing uncomfortable things! Make you late for dinner!"</p>
                    <cite className="text-sm text-primary font-semibold">- Bilbo Baggins</cite>
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-accent pl-6 italic text-lg" data-testid="quote-traditional">
                    <p className="text-muted-foreground mb-2">"Share and enjoy!"</p>
                    <cite className="text-sm text-primary font-semibold">- Traditional Hobbit saying</cite>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
