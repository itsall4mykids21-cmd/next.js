import { games } from '../data/games';

export default function SlotsGallery() {
  return (
    <div style={{ padding: '2em' }}>
      <h1>Slot Games Gallery</h1>
      {games.map((game, idx) => (
        <div key={idx} style={{ marginBottom: '2em', borderBottom: '1px solid #ddd', paddingBottom: '1em' }}>
          <h2>{game.name}</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {game.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${game.name} symbol ${i + 1}`}
                width={128}
                height={128}
                style={{ borderRadius: '8px', boxShadow: '0 0 8px #333' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}