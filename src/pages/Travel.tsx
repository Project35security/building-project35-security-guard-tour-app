import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plane, Calendar, Users, ArrowLeftRight, Check, Clock, Star, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext';
import { MOCK_FLIGHTS } from '@/data/mockData';
import { formatCurrency } from '@/lib/formatters';
import type { FlightResult } from '@/types';
import { cn } from '@/lib/utils';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';

interface SearchForm {
  from: string;
  to: string;
  departure: string;
  return?: string;
  passengers: number;
  class: string;
}

const POPULAR_ROUTES = [
  { from: 'New York', to: 'London', price: '$298' },
  { from: 'Lagos', to: 'London', price: '$420' },
  { from: 'Dubai', to: 'New York', price: '$580' },
  { from: 'Nairobi', to: 'Amsterdam', price: '$510' },
];

export default function Travel() {
  const { bookFlight, isProcessing, wallets } = useWallet();
  const { verifyPin } = useAuth();
  const [searchDone, setSearchDone] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [booked, setBooked] = useState(false);
  const [tripType, setTripType] = useState<'one-way' | 'return'>('return');
  const [flightClass, setFlightClass] = useState<'economy' | 'business'>('economy');

  const { register, handleSubmit, setValue, watch } = useForm<SearchForm>({
    defaultValues: { from: 'New York (JFK)', to: 'London (LHR)', departure: '2026-07-15', passengers: 1, class: 'economy' },
  });

  const usdBalance = wallets.find(w => w.currency === 'USD')?.balance ?? 0;

  const onSearch = () => {
    setSearchDone(true);
  };

  const handleBook = async () => {
    setPinError('');
    if (pin.length !== 4) { setPinError('Enter 4-digit PIN'); return; }
    const ok = await verifyPin(pin);
    if (!ok) { setPinError('Incorrect PIN. Use 1234 for demo.'); setPin(''); return; }
    if (!selectedFlight) return;
    const result = await bookFlight(selectedFlight.id, selectedFlight.price + 5);
    if (result.success) {
      setBookingRef(result.reference ?? '');
      setBooked(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Plane className="w-7 h-7 text-violet-400" /> Travel Booking
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Search and book flights worldwide</p>
      </div>

      {/* Search Form */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex gap-2 mb-5">
          {(['return', 'one-way'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                tripType === type ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              {type === 'return' ? 'Return' : 'One-way'}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {(['economy', 'business'] as const).map(c => (
              <button
                key={c}
                onClick={() => setFlightClass(c)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize',
                  flightClass === c ? 'bg-violet-600 text-white' : 'text-slate-400 border border-slate-600 hover:border-slate-500'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSearch)}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 flex items-center gap-1.5">
                <Plane className="w-3 h-3" /> From
              </Label>
              <Input
                {...register('from')}
                className="bg-slate-700 border-slate-600 text-white h-11 focus:border-violet-500"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 flex items-center gap-1.5">
                <Plane className="w-3 h-3 rotate-90" /> To
              </Label>
              <Input
                {...register('to')}
                className="bg-slate-700 border-slate-600 text-white h-11 focus:border-violet-500"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Departure
              </Label>
              <Input
                type="date"
                {...register('departure')}
                className="bg-slate-700 border-slate-600 text-white h-11 focus:border-violet-500"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Passengers
              </Label>
              <Input
                type="number"
                min="1"
                max="9"
                {...register('passengers')}
                className="bg-slate-700 border-slate-600 text-white h-11 focus:border-violet-500"
              />
            </div>
          </div>
          {tripType === 'return' && (
            <div className="mt-4 max-w-xs">
              <Label className="text-slate-400 text-xs mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Return Date
              </Label>
              <Input
                type="date"
                {...register('return')}
                defaultValue="2026-07-22"
                className="bg-slate-700 border-slate-600 text-white h-11 focus:border-violet-500"
              />
            </div>
          )}
          <Button type="submit" className="mt-5 w-full md:w-auto px-10 h-11 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 font-medium">
            Search Flights
          </Button>
        </form>
      </div>

      {!searchDone && (
        <div>
          <h2 className="text-white font-semibold mb-3">Popular Routes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_ROUTES.map(r => (
              <button
                key={`${r.from}-${r.to}`}
                onClick={() => { setValue('from', r.from); setValue('to', r.to); setSearchDone(true); }}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-left hover:border-violet-500/50 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                  <span>✈️</span>
                  <ArrowLeftRight className="w-3 h-3" />
                </div>
                <div className="text-white text-sm font-medium">{r.from}</div>
                <div className="text-slate-400 text-xs">→ {r.to}</div>
                <div className="text-violet-400 font-semibold text-sm mt-2">From {r.price}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flight Results */}
      {searchDone && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">{MOCK_FLIGHTS.length} flights found</h2>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Sort by:</span>
              <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-2 py-1">
                <option>Price (Low to High)</option>
                <option>Duration</option>
                <option>Departure Time</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_FLIGHTS.map(flight => (
              <div
                key={flight.id}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Airline */}
                  <div className="flex items-center gap-3 md:w-32">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
                      {flight.logo}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{flight.airlineCode}</div>
                      <div className="text-slate-400 text-xs">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex-1 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-white text-lg font-bold">{new Date(flight.departureTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                      <div className="text-slate-400 text-xs">{flight.departureAirport}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-slate-500 text-xs mb-1">{flight.duration}</div>
                      <div className="w-full flex items-center">
                        <div className="w-2 h-2 rounded-full border-2 border-slate-400 flex-shrink-0" />
                        <div className="flex-1 h-px bg-slate-600 relative">
                          {flight.stops === 0 ? (
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-violet-500 to-slate-600" />
                          ) : null}
                        </div>
                        <Plane className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <div className="flex-1 h-px bg-gradient-to-r from-violet-500 to-slate-600" />
                        <div className="w-2 h-2 rounded-full border-2 border-slate-400 flex-shrink-0" />
                      </div>
                      <div className="text-slate-500 text-xs mt-1">
                        {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-lg font-bold">{new Date(flight.arrivalTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                      <div className="text-slate-400 text-xs">{flight.arrivalAirport}</div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-normal gap-3 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{formatCurrency(flight.price, flight.currency)}</div>
                      <div className="text-slate-400 text-xs">per person</div>
                      {flight.seatsLeft <= 5 && (
                        <div className="text-amber-400 text-xs mt-1">{flight.seatsLeft} seats left!</div>
                      )}
                    </div>
                    <Button
                      onClick={() => { setSelectedFlight(flight); setConfirmOpen(true); setBooked(false); setPin(''); }}
                      className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 whitespace-nowrap"
                    >
                      Select
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  <span className="text-slate-500 text-xs">{flight.airline}</span>
                  <span className="text-slate-700">•</span>
                  <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-[10px] capitalize">{flight.class}</Badge>
                  {flight.stops === 0 && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Nonstop</Badge>}
                  <Luggage className="w-3 h-3 text-slate-500 ml-auto" />
                  <span className="text-slate-500 text-xs">1 carry-on included</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{booked ? 'Booking Confirmed!' : 'Confirm Booking'}</DialogTitle>
          </DialogHeader>

          {booked ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-2">Flight Booked!</p>
              <p className="text-slate-400 text-sm mb-1">
                {selectedFlight?.airline} {selectedFlight?.flightNumber}
              </p>
              <p className="text-slate-400 text-sm mb-4">
                {selectedFlight?.departureCity} → {selectedFlight?.arrivalCity}
              </p>
              <div className="bg-slate-800 rounded-xl p-4 text-left mb-4">
                <div className="text-slate-400 text-xs mb-1">Booking Reference</div>
                <div className="text-white font-mono text-lg font-bold">{bookingRef}</div>
              </div>
              <p className="text-slate-500 text-xs">A confirmation has been sent to your email and wallet.</p>
              <Button onClick={() => setConfirmOpen(false)} className="mt-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 w-full h-11">
                Done
              </Button>
            </div>
          ) : selectedFlight && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Flight</span>
                  <span className="text-white font-medium text-sm">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Route</span>
                  <span className="text-white font-medium text-sm">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Departure</span>
                  <span className="text-white font-medium text-sm">{new Date(selectedFlight.departureTime).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Class</span>
                  <span className="text-white font-medium text-sm capitalize">{selectedFlight.class}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total (incl. fees)</span>
                  <span className="text-white font-bold text-lg">{formatCurrency(selectedFlight.price + 5, selectedFlight.currency)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Your wallet balance: {formatCurrency(usdBalance, 'USD')}</span>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-3 text-center">Enter PIN to confirm booking</p>
                {pinError && <p className="text-red-400 text-xs mb-2 text-center">{pinError}</p>}
                <p className="text-slate-500 text-xs text-center mb-2">Demo PIN: 1234</p>
                <div className="flex justify-center mb-4">
                  <InputOTP maxLength={4} value={pin} onChange={setPin}>
                    <InputOTPGroup>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="bg-slate-800 border-slate-700 text-white w-12 h-12 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button
                  onClick={handleBook}
                  disabled={isProcessing || pin.length !== 4}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                >
                  {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Book Flight'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
