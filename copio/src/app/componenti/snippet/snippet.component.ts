import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { SnippetService } from '../../servizi/snippet.service';
import { GroupsService } from '../../servizi/groups.service';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-python.min.js';
import { Router } from '@angular/router';
import { AuthService } from '../../servizi/auth.service';

@Component({
  selector: 'app-snippet',
  standalone: false,
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
})
export class SnippetComponent implements OnInit {

  snippets: any = [];
  currentPage = 1;
  snippetsPerPage = 5;
  totalPages = 1;
  groups: any[] = [];
  filteredSnippets: any[] = [];
  selectedGroup: any;
  showCreateGroupModal = false;
  showCreateSnippetModal = false;
  newGroupName = '';
  isCopied = false;
  copiedIndex: number | null = null;
  newSnippet = { title: '', content: '', groupId: 0 };
  message: string = '';
  isDeleteModalVisible = false;
  snippetToDeleteName: any;
  snippetToDeleteId: any;
  userId!: any;

  // Fullscreen
  fullscreenSnippet: any = null;

  constructor(
    private snippetService: SnippetService,
    private groupService: GroupsService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    this.loadGroups();
  }

  // Chiudi fullscreen con ESC
  @HostListener('document:keydown.escape')
  closeFullscreen() {
    this.fullscreenSnippet = null;
  }

  openFullscreen(snippet: any, index: number) {
    this.fullscreenSnippet = { ...snippet, _index: index };
    // Previeni scroll del body quando fullscreen è aperto
    document.body.style.overflow = 'hidden';
  }

  closeFullscreenWithCleanup() {
    this.fullscreenSnippet = null;
    document.body.style.overflow = '';
  }

  // Snippet della pagina corrente
  paginatedSnippets(): any[] {
    const start = (this.currentPage - 1) * this.snippetsPerPage;
    return this.filteredSnippets.slice(start, start + this.snippetsPerPage);
  }

  loadGroups() {
    this.groupService.getGroupsByUserId(this.userId).subscribe(
      (data) => {
        this.groups = data;
        if (this.groups.length > 0) {
          this.selectedGroup = this.groups[0];
          this.filterSnippetsByGroup(this.selectedGroup.idGroup);
        }
      },
      (error) => console.error('Errore nel caricamento dei gruppi:', error)
    );
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.currentPage = 1;
    this.filterSnippetsByGroup(group.idGroup);
    this.cdr.detectChanges();
  }

  filterSnippetsByGroup(groupId: number) {
    this.snippetService.getSnippetsByUserId(this.userId).subscribe({
      next: (data) => {
        this.snippets = data;
        this.filteredSnippets = this.snippets
          .filter((s: any) => s.idGroup && s.idGroup.idGroup === groupId)
          .map((s: any) => {
            const language = this.getLanguageForSnippet(s);
            const formattedContent = Prism.highlight(
              s.content,
              Prism.languages[language] || Prism.languages['plaintext'],
              language
            );
            return { ...s, content: formattedContent, language };
          });
        this.updateTotalPages();
        if (this.currentPage > this.totalPages) {
          this.currentPage = Math.max(1, this.totalPages);
        }
      },
      error: (err) => console.error('Errore nel caricamento degli snippet:', err)
    });
  }

  updateTotalPages() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredSnippets.length / this.snippetsPerPage));
  }

  changePage(direction: string) {
    if (direction === 'prev' && this.currentPage > 1) this.currentPage--;
    else if (direction === 'next' && this.currentPage < this.totalPages) this.currentPage++;
  }

  getLanguageForSnippet(snippet: any): string {
    const c = snippet.content || '';
    if (c.includes('<html>') || c.includes('</div>')) return 'html';
    if (c.includes('import ') && (c.includes('from ') || c.includes('@Component'))) return 'typescript';
    if (c.includes('function') || c.includes('const ') || c.includes('let ')) return 'javascript';
    if (c.includes('public ') || c.includes('void ') || c.includes('class ') && c.includes('{')) return 'java';
    if (c.includes('def ') || c.includes('print(')) return 'python';
    return 'javascript';
  }

  copyCode(index: number) {
    const id = this.fullscreenSnippet ? `codeBlock-fs-${index}` : `codeBlock-${index}`;
    const codeBlock = document.getElementById(id)?.textContent;
    if (codeBlock) {
      navigator.clipboard.writeText(codeBlock.trim()).then(() => {
        this.copiedIndex = index;
        setTimeout(() => { this.copiedIndex = null; }, 2000);
      });
    }
  }

  openCreateGroupModal() { this.showCreateGroupModal = true; }
  closeCreateGroupModal() { this.showCreateGroupModal = false; }
  closeAllModals() {
    this.showCreateGroupModal = false;
    this.showCreateSnippetModal = false;
  }

  createGroup() {
    if (this.newGroupName.trim()) {
      this.groupService.createGroup(this.newGroupName, this.userId).subscribe(
        () => {
          this.loadGroups();
          this.newGroupName = '';
          this.closeCreateGroupModal();
        },
        (err) => console.error('Errore nella creazione del gruppo:', err)
      );
    }
  }

  openCreateSnippetModal() { this.showCreateSnippetModal = true; }
  closeCreateSnippetModal() { this.showCreateSnippetModal = false; }

  createSnippet() {
    if (this.newSnippet.title.trim() && this.newSnippet.content.trim()) {
      this.newSnippet.groupId = this.selectedGroup.idGroup;
      this.snippetService
        .createSnippetByUser(this.newSnippet, this.userId, this.selectedGroup.idGroup)
        .subscribe({
          next: (newSnippet) => {
            const language = this.getLanguageForSnippet(newSnippet);
            const formattedContent = Prism.highlight(
              newSnippet.content,
              Prism.languages[language] || Prism.languages['plaintext'],
              language
            );
            this.filteredSnippets = [
              ...this.filteredSnippets,
              { ...newSnippet, content: formattedContent, language }
            ];
            this.updateTotalPages();
            this.newSnippet = { title: '', content: '', groupId: 0 };
            this.closeCreateSnippetModal();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Errore nella creazione dello snippet:', err)
        });
    }
  }

  openDeleteModal(snippetId: number, index: number) {
    this.snippetToDeleteId = snippetId;
    const pageStart = (this.currentPage - 1) * this.snippetsPerPage;
    this.snippetToDeleteName = this.filteredSnippets[pageStart + index]?.title;
    this.isDeleteModalVisible = true;
  }

  closeDeleteModal() { this.isDeleteModalVisible = false; }

  deleteSnippet() {
    this.snippetService.deleteSnippetsByUserId(this.userId, this.snippetToDeleteId).subscribe(
      () => {
        this.filterSnippetsByGroup(this.selectedGroup.idGroup);
        this.closeDeleteModal();
      },
      (err) => console.error('Errore nell\'eliminazione:', err)
    );
  }

  goBack() { this.router.navigate(['/']); }
}