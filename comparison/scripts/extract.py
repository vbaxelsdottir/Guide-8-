"""Read sibling projects; write only comparison/data.json. No project changes."""
from pathlib import Path
import json, hashlib
root=Path(__file__).resolve().parents[2]
out=root/'comparison'
frameworks=['react','vue','angular']
def item(file,start,end,explanation):
 lines=(root/file).read_text().splitlines()
 return dict(file=file,start=start,end=end,code='\n'.join(lines[start-1:end]),explanation=explanation)
concepts=[]
def add(id,title,summary,rows):
 concepts.append(dict(id=id,title=title,summary=summary,examples={f:item(*r) for f,r in zip(frameworks,rows)}))
add('state','State & reactivity','The same information, held in three different reactive APIs.',[
('react/src/App.tsx',23,27,'useState returns a value and its setter. The parent owns the open door, history, movie list and editor state.'),
('vue/src/App.vue',15,19,'ref holds reactive state. Script code reads and writes .value; Vue templates unwrap it automatically.'),
('angular/src/app.ts',19,23,'signal holds each value. Read it with parentheses and change it with .set() or .update().')])
add('lists','Rendering 24 doors','One movie array becomes 24 reusable door components.',[
('react/src/components/Calendar.tsx',6,11,'map() is ordinary JavaScript. It returns a CalendarDoor for each movie; key uses the stable day number.'),
('vue/src/components/Calendar.vue',9,14,'v-for repeats the component. :key identifies each day; colon bindings pass data into props.'),
('angular/src/components/calendar.ts',7,13,'@for repeats the component and track movie.day identifies it. Square brackets bind the child inputs.')])
add('conditions','Conditional rendering','The movie title enters the rendered card only when that door is open.',[
('react/src/components/CalendarDoor.tsx',26,28,'The JSX expression uses JavaScript &&. When isOpen is false, the back-face content is not rendered.'),
('vue/src/components/CalendarDoor.vue',22,28,'v-if includes the back-face content only when isOpen is true. The template wrapper adds no extra element.'),
('angular/src/components/calendar-door.ts',17,21,'@if includes the movie content when the isOpen input signal is true. The surrounding back face stays in place.')])
add('events','Click events','Each door tells its parent which day was clicked.',[
('react/src/components/CalendarDoor.tsx',15,18,'onClick calls the onToggle callback prop with movie.day. The parent changes the state.'),
('vue/src/components/CalendarDoor.vue',11,14,'@click emits a toggle event containing the day. Calendar forwards this event to App.'),
('angular/src/components/calendar-door.ts',8,9,'(click) emits the day through a typed output. Calendar forwards it to the application component.')])
add('components','Component structure','Each app separates the calendar, door, countdown and editor.',[
('react/src/components/Countdown.tsx',1,8,'A typed function receives a date prop and returns JSX. This entire file is the small Countdown component.'),
('vue/src/components/Countdown.vue',1,10,'A Single-File Component contains TypeScript setup and a template. defineProps declares the date input.'),
('angular/src/components/countdown.ts',4,14,'@Component declares a standalone component and its template. The class contains its input and derived value.')])
add('communication','Parent → child → parent','Values go down; a day number comes back up.',[
('react/src/components/Calendar.tsx',4,10,'Props contain both values and an onToggle function. Calendar passes that same function to each door.'),
('vue/src/components/Calendar.vue',5,13,'defineProps types the incoming data; defineEmits types the outgoing toggle event. Calendar explicitly re-emits the child event.'),
('angular/src/components/calendar.ts',15,22,'input.required declares incoming values and output<number> declares the outgoing day. The template forwards child events.')])
add('one-door','Only one open door','Store one day number, not an open flag on every movie.',[
('react/src/App.tsx',58,62,'The setter replaces the current day, or clears it when clicked again. openedDays is a separate history array.'),
('vue/src/App.vue',44,48,'The ref receives one day number or null. Previously opened days are added to a separate array without duplicates.'),
('angular/src/app.ts',60,64,'The signal update uses the same conditional expression as React. History is updated separately from the visible door.')])
add('forms','Editing movie titles','A local draft protects the saved movie list until Save.',[
('react/src/components/MovieEditor.tsx',24,28,'The controlled input reads movie.title. onChange maps to a new draft array and replaces just the edited movie object.'),
('vue/src/components/MovieEditor.vue',23,25,'v-model updates the title on the reactive draft object. This makes the input binding shorter in this implementation.'),
('angular/src/components/movie-editor.ts',10,14,'[value] reads the draft title; (input) calls updateTitle using a template reference. This app uses manual bindings, not Angular Forms.')])
add('storage','Remembering opened days','Persist history while leaving the current open door temporary.',[
('react/src/App.tsx',31,38,'useEffect saves history when openedDays or year changes. Its dependency array is explicit.'),
('vue/src/App.vue',35,42,'watch observes openedDays and also runs immediately. The toggle handler replaces the array, so this watcher does not need deep mode.'),
('angular/src/app.ts',34,42,'effect reads history and year signals, establishing its dependencies. All three use the same JSON and localStorage format.')])
add('dates','Date locking','This business rule is ordinary TypeScript in all three apps.',[
('react/src/date.ts',12,14,'December is month 11 in JavaScript. Unlock through today, capped at 24; other months return zero.'),
('vue/src/date.ts',15,17,'The same rule is copied into Vue. Available-day state is derived from the current or simulated date.'),
('angular/src/date.ts',16,18,'The exact same calculation appears in Angular. A computed signal exposes the result to the template.')])
add('countdown','Countdown & derived values','The calculation is shared; the way it is connected to the UI differs.',[
('react/src/components/Countdown.tsx',3,7,'React calls daysUntilChristmas during rendering. There is no useMemo for this small calculation.'),
('vue/src/components/Countdown.vue',2,5,'computed derives the number of days from the date prop. The template reads days without .value.'),
('angular/src/components/countdown.ts',11,14,'computed derives days from the date input signal. The template reads the result as days().')])
metrics=[]
manifest={}
for f in frameworks:
 base=root/f
 files=[p for p in (base/'src').rglob('*') if p.suffix in ['.ts','.tsx','.vue','.html'] and p.name!='index.html']
 component=[p for p in files if p.name not in ['date.ts','storage.ts','movies.ts','main.ts','main.tsx']]
 pkg=json.loads((base/'package.json').read_text());lock=json.loads((base/'package-lock.json').read_text())
 name={'react':'react','vue':'vue','angular':'@angular/core'}[f]
 metrics.append(dict(id=f,version=lock['packages']['node_modules/'+name]['version'],typescript=lock['packages']['node_modules/typescript']['version'],files=len(files),lines=sum(len(p.read_text().splitlines()) for p in files),componentLines=sum(len(p.read_text().splitlines()) for p in component),dependencies=len(pkg.get('dependencies',{})),devDependencies=len(pkg.get('devDependencies',{})),fileList=[str(p.relative_to(root)) for p in sorted(files)]))
 for p in base.rglob('*'):
  if p.is_file() and not set(p.relative_to(base).parts).intersection({'node_modules','dist','.angular','.git','out-tsc'}):
   manifest[str(p.relative_to(root))]=hashlib.sha256(p.read_bytes()).hexdigest()
shared={n:len({hashlib.sha256((root/f/'src'/n).read_bytes()).hexdigest() for f in frameworks})==1 for n in ['movies.ts','storage.ts','styles.css']}
(out/'data.json').write_text(json.dumps(dict(concepts=concepts,metrics=metrics,shared=shared),indent=2)+'\n')
(out/'source-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Extracted 33 exact snippets; measured source files; snapshotted all three projects.')
