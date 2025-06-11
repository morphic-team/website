import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ExtensionStatus {
  isChecking: boolean;
  isInstalled: boolean;
  version: string;
  isChromeBrowser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {
  readonly REQUIRED_EXTENSION_VERSION = '1.0.0';
  readonly PRODUCTION_EXTENSION_ID = 'fhigbmfhhlpkjbdamhjmfajhkfbkkgah';

  checkExtensionStatus(): Observable<ExtensionStatus> {
    const subject = new Subject<ExtensionStatus>();
    
    // Check if Chrome browser
    if (!this.isChromeBrowser()) {
      subject.next({
        isChecking: false,
        isInstalled: false,
        version: '',
        isChromeBrowser: false
      });
      subject.complete();
      return subject.asObservable();
    }

    // Start checking
    subject.next({
      isChecking: true,
      isInstalled: false,
      version: '',
      isChromeBrowser: true
    });

    // Set timeout
    const timeoutId = setTimeout(() => {
      subject.next({
        isChecking: false,
        isInstalled: false,
        version: '',
        isChromeBrowser: true
      });
      subject.complete();
    }, 2000);

    // Try to communicate with extension
    if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
      (window as any).chrome.runtime.sendMessage(this.PRODUCTION_EXTENSION_ID, { action: 'getVersion' }, (response: any) => {
        clearTimeout(timeoutId);
        
        if ((window as any).chrome.runtime.lastError || !response) {
          subject.next({
            isChecking: false,
            isInstalled: false,
            version: '',
            isChromeBrowser: true
          });
        } else {
          subject.next({
            isChecking: false,
            isInstalled: true,
            version: response.version || '',
            isChromeBrowser: true
          });
        }
        subject.complete();
      });
    } else {
      // No Chrome runtime
      clearTimeout(timeoutId);
      subject.next({
        isChecking: false,
        isInstalled: false,
        version: '',
        isChromeBrowser: true
      });
      subject.complete();
    }

    return subject.asObservable();
  }

  isChromeBrowser(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('chrome') && !userAgent.includes('edg/'); // Chrome but not Edge
  }

  isVersionValid(version: string): boolean {
    return version === this.REQUIRED_EXTENSION_VERSION;
  }

  isExtensionValid(status: ExtensionStatus): boolean {
    return status.isChromeBrowser && status.isInstalled && this.isVersionValid(status.version);
  }
}