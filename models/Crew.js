const mongoose = require('mongoose');

// Schema for Awards
const awardSchema = new mongoose.Schema({
  awardName: { type: String, required: true }, // e.g., Oscars, Golden Globes
  category: { type: String, required: true },  // e.g., Best Actor, Best Director
  year: { type: Number, required: true },      // Year of the award
  won: { type: Boolean, required: true }       // Whether the award was won
});

// Crew Schema
const crewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Actor', 'Director', 'Crew'], required: true }, // Role in the film industry
  biography: { type: String },
  awards: [awardSchema],                     // Array of awards
  filmography: [{                            // Array of movies the crew member was part of
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }, // Reference to Movie model
    character: String // Optional character name for actors
  }],
  photo: { type: String },                   // URL to the crew member's photo
  birthDate: { type: Date },
  deathDate: { type: Date, default: null },
  nationality: { type: String },             // Added nationality for additional details
  notableWorks: [String]                     // List of notable works (e.g., "Inception", "Titanic")
}, { timestamps: true });

module.exports = mongoose.model('Crew', crewSchema);
