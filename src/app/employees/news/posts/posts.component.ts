import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  newPostForm: FormGroup;
  posts: any;

  constructor(private dataService: DataService, private ngZone: NgZone) {}
  @ViewChild('autosizePost') autosizePost: CdkTextareaAutosize;
  @ViewChild('autosizeEditor') autosizeEditor: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.autosizePost.resizeToFitContent(true);
      this.autosizeEditor.resizeToFitContent(true);
    });
  }
  ngOnInit() {
    this.newPostForm = new FormGroup({
      htmlContent: new FormControl(null)
    });
    this.fetchPosts();
  }

  fetchPosts() {
    this.dataService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  addPost() {
    const post = { description: this.newPostForm.get('htmlContent').value };
    this.dataService.addPost(post).subscribe(
      result => {
        console.log(result);
        this.fetchPosts();
        this.newPostForm.get('htmlContent').reset();
      },
      err => console.log(err)
    );
  }

  onDeletePost(post_id: number) {
    this.dataService.deletePost(post_id).subscribe(() => {
      this.fetchPosts();
    });
  }
}
