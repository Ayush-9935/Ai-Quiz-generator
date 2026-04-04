import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
    <p className="text-slate-500 font-medium">{message}</p>
  </div>
);

export default Loading;
